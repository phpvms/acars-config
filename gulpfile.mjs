import dotconfig from '@dotenvx/dotenvx'
import Ajv from 'ajv'
import { deleteSync as del } from 'del'
import fs from 'fs'
import { dest, series, src, watch } from 'gulp'
import eslint from 'gulp-eslint-new'
import prettier from 'gulp-prettier'
import ts from 'gulp-typescript'
import zip from 'gulp-zip'

dotconfig.config()

/**
 * Different paths we use...
 * Don't modify this directly, use the environment variables
 */
const paths = {
  /**
   * ACARS scripts/config directory. This, by default, points to the home directory
   * But you can change this to point to a local directory
   */
  acars: process.env.ACARS_SCRIPTS_PATH,

  src: './src',
  out: './dist',
  export: './dist',

  /**
   * Build output that is published on its own rather than inside the scripts
   * zip. Kept outside dist/ precisely so buildZipTask does not sweep it in.
   */
  artifacts: './artifacts',
}

/**
 * Build the project, copy the appropriate files over
 * @public
 */
export const build = series(
  buildTsTask,
  copySoundsTask,
  copyMappingsTask,
  buildAircraftConfigsTask,
  buildSettingsTask,
  copyPackageJsonTask,
)

/**
 * Clean the build directories
 * @public
 */
export const clean = cleanTask

/**
 * Build a distribution zip file, which can be easily uploaded
 * @public
 */
export const dist = series(clean, build, buildZipTask)

/**
 * Watch the files and distribute them to the
 * documents/vmsacars/data/<profile>/config directory
 * @public
 */
export const dev = localBuildTask

/**
 * The build steps that run from the csproj
 * Force the output path to go into our build directory
 * @internal
 */
export const csbuild = series(
  async () => {
    paths.acars = '../Content/config/default'
  },
  build,
  copyFilesToAcarsPathTask,
  copyAircraftConfigsToAcarsPathTask,
)

/**
 * The default action
 * @default
 * @public
 */
export default build

/**
 *
 *
 *
 */

/**
 * Configure the ts transpilation
 *
 */
const tsProject = ts.createProject('tsconfig.json')

/**
 * Build the Typescript files
 */
function buildTsTask() {
  // ensure the dist directory exists
  if (!fs.existsSync(paths.out)) {
    fs.mkdirSync(paths.out)
  }

  let pipeline = tsProject
    .src()
    .pipe(eslint())
    .pipe(eslint.failAfterError())
    .pipe(tsProject())
    .js.pipe(prettier())
    .pipe(dest(paths.out))

  // Minify/mangle output
  /*
  pipeline = pipeline.pipe(minify({
    mangle: false,
  }))*/

  return pipeline
}

/**
 * This copies the package.json file to the output directory
 *
 */
function copySoundsTask() {
  return src([paths.src + '/sounds/**/*'], { encoding: false }).pipe(
    dest(paths.out + '/sounds'),
  )
}

/**
 * This copies the mappings directory to the output directory
 *
 */
function copyMappingsTask() {
  return src([paths.src + '/mappings/**/*'], { encoding: false }).pipe(
    dest(paths.out + '/mappings'),
  )
}

/**
 * Bundles every aircraft feature-config document into one JSON artifact.
 *
 * The client downloads this file directly rather than pulling the configs out
 * of the scripts zip, so it is written to artifacts/ and deliberately NOT into
 * dist/ — anything under dist/ ends up in the zip, and the whole point is that
 * the aircraft configs travel on their own.
 *
 * Shape is deliberately dumb: a map of source filename (without .json) to that
 * file's parsed contents, i.e. the directory serialized. The client writes each
 * entry straight back out as <key>.json, so the on-disk layout it ends up with
 * is identical to src/aircraft/ and nothing has to agree on a richer schema.
 * That also keeps _default_flaps working — it is a bare array rather than a
 * config document, and a filename-keyed map carries it without a special case.
 */
function buildAircraftConfigsTask(done) {
  const dir = paths.src + '/aircraft'
  const bundle = {}

  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.json')) {
      continue
    }

    const key = file.slice(0, -'.json'.length)
    try {
      bundle[key] = JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'))
    } catch (err) {
      // Naming the file matters: a bare SyntaxError across 36 documents says nothing about
      // which one is broken.
      done(new Error(`${dir}/${file}: ${err.message}`))

      return
    }
  }

  const count = Object.keys(bundle).length
  if (count === 0) {
    done(new Error(`No aircraft config documents found in ${dir}`))

    return
  }

  fs.mkdirSync(paths.artifacts, { recursive: true })
  fs.writeFileSync(
    paths.artifacts + '/aircraft.json',
    JSON.stringify(bundle),
    'utf8',
  )

  console.log(`aircraft.json: bundled ${count} documents`)
  done()
}

/**
 * Builds the flight-thresholds settings document into one JSON artifact.
 *
 * Same publishing story as aircraft.json: the client downloads this file on
 * its own (acars.settings_url), so it is written to artifacts/ and not into
 * dist/. The source is split so an override is one small file: defaults.json
 * holds every key, and each overrides/*.json is one selector plus the keys it
 * changes. Overrides are concatenated in filename order, which is also the
 * order the client applies them in, so a filename is the only ordering knob.
 *
 * Everything is validated against src/types/settings.schema.json before it is
 * written. A typo here reaches every client within a release cycle, so an
 * unknown key, an out-of-range value or a selector-less override fails the
 * build rather than shipping.
 */
function buildSettingsTask(done) {
  const dir = paths.src + '/settings'
  const overridesDir = dir + '/overrides'
  const schemaFile = paths.src + '/types/settings.schema.json'

  // strictRequired is the one strict check we drop: the override selector rule
  // is "icao or class" spelled as an anyOf of bare `required` branches, and that
  // check wants the properties re-declared inside every branch.
  const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false })
  const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'))
  const validateDocument = ajv.compile(schema)

  // Sub-schemas for the source files, so an error names the file it came from
  // instead of an index into the assembled artifact.
  const validateDefaults = ajv.compile({ $ref: `${schema.$id}#/definitions/values` })
  const validateOverride = ajv.compile({ $ref: `${schema.$id}#/definitions/override` })

  const fail = (file, message) => {
    done(new Error(`${file}: ${message}`))
  }

  const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
  const describe = (errors) => ajv.errorsText(errors, { separator: '; ' })

  let defaults
  const defaultsFile = dir + '/defaults.json'
  try {
    defaults = read(defaultsFile)
  } catch (err) {
    fail(defaultsFile, err.message)

    return
  }

  if (!validateDefaults(defaults)) {
    fail(defaultsFile, describe(validateDefaults.errors))

    return
  }

  const overrides = []
  const overrideFiles = fs.existsSync(overridesDir)
    ? fs.readdirSync(overridesDir).sort()
    : []

  for (const file of overrideFiles) {
    if (!file.endsWith('.json')) {
      continue
    }

    const path = `${overridesDir}/${file}`
    let override
    try {
      override = read(path)
    } catch (err) {
      fail(path, err.message)

      return
    }

    if (!validateOverride(override)) {
      fail(path, describe(validateOverride.errors))

      return
    }

    overrides.push(override)
  }

  const document = { version: 1, defaults, overrides }

  // Belt and braces: the pieces were valid, so the whole must be too. If this
  // ever trips, the schema and this task have drifted apart.
  if (!validateDocument(document)) {
    fail(schemaFile, describe(validateDocument.errors))

    return
  }

  fs.mkdirSync(paths.artifacts, { recursive: true })
  fs.writeFileSync(
    paths.artifacts + '/settings.json',
    JSON.stringify(document),
    'utf8',
  )

  console.log(
    `settings.json: ${Object.keys(defaults).length} defaults, ${overrides.length} overrides`,
  )
  done()
}

/**
 * This copies the package.json file to the output directory
 *
 */
function copyPackageJsonTask() {
  return src([paths.src + '/package.json']).pipe(dest(paths.out))
}

/**
 * Copy the files from dist into ACARS_SCRIPTS_PATH
 */
function copyFilesToAcarsPathTask() {
  console.log(`Copying files to ${paths.acars}`)

  return src(['./**/*', '!node_modules/**/*'], { cwd: paths.out }).pipe(
    dest(paths.acars),
  )
}

/**
 * Deliver the aircraft configs for local use, straight from src/.
 *
 * They are deliberately absent from dist/, because they ship as their own bundle rather than
 * inside the zip, so copying dist/ alone would leave a locally-built client with no aircraft
 * configs at all. The client reads them from the aircraft directory, which is the same place the
 * downloaded bundle gets exploded to, so this puts a developer in the same state a download would.
 */
function copyAircraftConfigsToAcarsPathTask() {
  return src([paths.src + '/aircraft/**/*.json']).pipe(
    dest(paths.acars + '/aircraft'),
  )
}

/**
 * Build the zip that should get uploaded
 */
function buildZipTask() {
  console.log('Writing zip named ' + process.env.ACARS_DIST_ZIP)
  if (!fs.existsSync(paths.export)) {
    fs.mkdirSync(paths.export)
  }

  return (
    src(paths.out + '/**/*', { base: paths.out })
      /*.pipe(tap(function (file) {
      console.log('file: ' + file.path)
    }))*/
      .pipe(zip(process.env.ACARS_DIST_ZIP, { buffer: true }))
      .pipe(dest(paths.export))
  )
}

/**
 * Watch the files and then build and copy them to the documents directory
 */
function localBuildTask() {
  return watch(
    paths.src,
    { ignoreInitial: false },
    series(build, copyFilesToAcarsPathTask, copyAircraftConfigsToAcarsPathTask),
  )
}

/**
 * Clean up the /dest directory
 */
async function cleanTask() {
  return del([
    paths.out,
    paths.artifacts,
    paths.export + '/' + process.env.ACARS_DIST_ZIP,
  ])
}

/**
 * Copy the PDK files to the PDK and config repos
 * @internal
 * @returns {Promise<void>}
 */
function updatePdk() {
  if (!process.env.PDK_DEST || !process.env.CFG_DEST) {
    console.error('PDK_DEST and CFG_DEST must be set')
    return
  }
}
