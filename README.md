# vmsACARS Plugin Development Kit (PDK)

## Overview

The plugins and scripts for vmsACARS are written in Typescript, and then
transpiled to JS. Typescript ensures that the interfaces required are following,
and that the proper things are returned so ACARS can run them. While Typescript
isn't required, it's best to use it to ensure proper values are passed - especially
around enums.

This PDK includes build scripts to:

- Convert Typescript to JS, with type checking/linting
- Stamp the distribution package with versioning
- Github Actions to build and deploy
- Scripts to help with development

---

# The General Steps

First, fork this repository. Follow the setup below. Then start editing the
scripts in the `/src` directory, depending on what you want to do. Then, you
can distribute it to your pilots.

- Complete the setup, including the `.env` file
- Disable downloading the latest updates
- Run `npm run dev` to then test in ACARS
- Run `npm run dist` to create the ZIP
- Upload this zip somewhere
- Update the phpVMS ACARS Admin to point to the above URL
- ???
- Profit!

### Structure

All of the scripts are contained in the `/src` folder.

# Setup

## Required:

- nodejs/npm or pnpm
- Typescript
- Gulp

Run:

```shell
npm install
```

### Customizing using the `.env` file:

Next, copy the `.env.default` to `.env`. Then edit this file to change the
profile name.

The available options:

- `ACARS_PROFILE_NAME` - The default profile to use for testing
- `ACARS_CONFIG_PATH` - The default usually works, but you can change this to
  the path where you put ACARS, if you did a
  local install
- `ACARS_SCRIPTS_PATH` - Uses the `ACARS_PROFILE_NAME` to build the path to
  where the scripts should be sent after a
  build
- `ACARS_DIST_ZIP` - The distribution filename

---

### Commands

Then there are multiple commands you can use:

#### To run a build:

This creates a `dist` directory, with all of the JS files in it

```shell
npm run build
```

This doesn't copy it anywhere, just runs a compile and build

#### Automatically build and copy to ACARS

This will setup a watch, and then automatically transpile and then copy the
contents of the
`dist` folder into the `ACARS_PROFILE_PATH` directory that's defined in the
`.env` file.

```shell
npm run dev
```

### Create a distribution file

Running:

```shell
npm run dist
```

Creates a `dist.zip` (you can rename it in the `.env` file) after running a
compile. You can modify the `gulpfile.mjs` to include other files - by default,
anything in the `dist` directory gets packaged. You can then configure
Github Actions to then upload this zip somewhere for ACARS to download.

### Disable Downloading Latest Defaults

Sometimes, it's just useful to disable downloading of the latest defaults, and
just edit the scripts that are included to see how they work. To do that, create
a file in your `Documents/vmsacars` directory, called `appsettings.local.json`,
and place the following:

```json filename="appsettings.local.json"
{
  "Config": {
    "App": {
      "DownloadConfig": false
    }
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Verbose"
    }
  }
}
```

You can also adjust the log level to "Information", "Debug" or "Verbose"
("Debug" is recommended)

---

# Development Documentation

There are several core files/interfaces that are included:

### `src/global.d.ts`

This describes the globally available functions, including the logging methods
available through `console` and `Acars`.

### `src/types.d.ts`

This contains all of the base types:

- `Pirep` - data that's available about a PIREP, and it's associated
  interfaces (`Airport`, `Runway`, etc)
- `Telemetry` - telemetry information that's come out of the simulator
- `User` - information about the current user

It also includes other detailed type information, for example `Length`, so you
can retrieve that type of information.

---

## Aircraft Configuration

An aircraft config tells the client how to read one aircraft's state out of the
simulator. It says which variable holds the beacon light state, what the flap
detents are called, and which aircraft the document applies to in the first
place.

Configs are JSON documents in `src/aircraft/`, one per aircraft. They aren't
code. The client evaluates them with a rules engine, so a config can be edited,
or written from scratch in the phpVMS admin, without shipping a new build.

A complete config, small enough to read in one go:

```json
{
  "meta": { "id": "example", "name": "example", "sim": "msfs", "priority": 2, "author": "acars" },
  "match": [
    [
      { "scope": "title", "op": "contains", "keyword": "example" },
      { "scope": "title", "op": "contains", "keyword": "aircraft" }
    ]
  ],
  "mappings": {
    "flapNames": [
      { "value": 0, "label": "UP" },
      { "value": 1, "label": "CONF 1" }
    ]
  },
  "disabled": { "BeaconLights": true },
  "features": {
    "BeaconLights": [
      { "action": { "value": false } }
    ]
  }
}
```

There are five top-level keys. `meta`, `match` and `features` are required.
`mappings` and `disabled` are optional.

### `meta`

- `id` - unique across all configs. It's also the filename by convention.
- `name` - what gets shown to the user.
- `author`
- `sim` - one of `msfs`, `msfs20`, `msfs24`, `xplane`, `fsuipc`. See
  [Targeting MSFS versions](#targeting-msfs-versions).
- `priority` - 1 (lowest) to 10 (highest). It only comes into play when two
  configs match the same aircraft. See [Priority](#priority).
- `version` - optional integer, 0 when absent. When two configs share the same
  `id` (a stale cached copy and the client's bundled copy, say), the higher
  `version` wins; a tie keeps scan order. Bump it whenever a default changes
  so an old download cannot shadow it. The per-sim defaults carry `"version": 1`.

The per-sim defaults (`_default_msfs`, `_default_xplane`, `_default_fsuipc`)
are priority 1, and the aircraft-specific configs are priority 2. Write your own
at 3 or higher if you want them to take precedence.

### `match`

This decides which aircraft the config applies to. The client tests it against
two values from the simulator, and `either` covers both at once:

- `title` - the aircraft title. On MSFS this is the ICAO. On FSX/P3D it's the
  title field at offset `0x3D00`, and on X-Plane it's
  `sim/aircraft/view/acf_descrip`.
- `config_path` - the aircraft's configuration file path.
- `either` - matches when `title` or `config_path` does.

`match` is an array of arrays. Everything inside an inner array has to match,
and any one inner array matching is enough. The block below reads as "fenix and
a320, or fenix and a321":

```json
"match": [
  [
    { "scope": "title", "op": "contains", "keyword": "fenix" },
    { "scope": "either", "op": "contains", "keyword": "a320" }
  ],
  [
    { "scope": "title", "op": "contains", "keyword": "fenix" },
    { "scope": "either", "op": "contains", "keyword": "a321" }
  ]
]
```

`op` is either `contains` or `equals`. Both sides are lowercased first, so
matching ignores case.

### `features`

Each key is a feature name, and its value is a ruleset: an ordered list of
branches that the client walks top to bottom, stopping at the first one that
matches. A branch with no `if` always matches, which makes it the final else.

```json
"BeaconLights": [
  { "if": { "all": [{ "kind": "lvar", "address": "S_OH_EXT_LT_BEACON", "valueType": "int", "operator": "equal", "value": 1 }] },
    "action": { "value": true } },
  { "action": { "value": false } }
]
```

So: if the lvar equals 1 the beacon is on, otherwise it's off.

The feature names are fixed. The client knows this set and nothing else:

`BeaconLights`, `LandingLights`, `LogoLights`, `NavigationLights`,
`StrobeLights`, `TaxiLights`, `WingLights`, `Flaps`, `APU`, `Doors`,
`Seatbelts`, `EmergencyLights`, `AntiIce`, `Battery`, `Packs`, `ParkingBrakes`,
`Engines`, `Transponder`, `LandingGear`, `Autopilot`, `ExternalPower`,
`ThrustReversers`, `Spoilers`, `SpoilersArmed`.

`ThrustReversers` and `Spoilers` are value-carrying: they emit a number (or an
array of numbers, one per engine, for the reversers), not just on or off.
`ThrustReversers` is the deploy ratio 0..1 per engine, or a bool array when the
sim can only say engaged or not. `Spoilers` is the handle position 0..1.
`SpoilersArmed` is a plain boolean. The client treats a value above 0.05 as
deployed.

The three are new. Put the constructs they need (`fromFacts`, `scale`/`clamp`,
numeric literals, `int16`, `provenance`) only inside these feature keys: an older
client skips a feature key it does not know, with a warning, and never parses
what is inside it, so nothing else in the file is affected.

A name outside that set gets rejected when the config is imported. An older
client that doesn't recognize a newer name skips that one feature and logs a
warning instead of throwing out the whole document.

#### Naming a simulator variable

Conditions, and some actions, point at a variable using three fields:

- `kind` - `lvar`, `simvar`, `dataref` or `offset`.
- `address` - where to find it. An FSUIPC offset, an X-Plane DRef, or on MSFS
  either an LVar name or a Simvar. Simvars get an `A:` prefix and carry their
  type, like `A:LIGHT LOGO,bool`.
- `valueType` - `bool`, `int`, `int16`, `number`, `byte`, `intArray` or
  `numberArray`. `int16` is a signed 16-bit value, used for FSUIPC offsets that
  are two bytes wide (an `int` reads four). X-Plane and MSFS treat it as `int`.

Array-valued variables take an `index` to pick out one element. That still
reads from the same subscription rather than setting up a second one.

#### Comparing it

A condition is one of those variable references plus an `operator` and a
`value`. The operators are the json-rules-engine built-ins (`equal`,
`notEqual`, `lessThan`, `lessThanInclusive`, `greaterThan`,
`greaterThanInclusive`, `in`, `notIn`, `contains`, `doesNotContain`) plus two
of our own:

- `bitsSet` - true when every bit set in `value` is also set in the variable.
- `noneEqual` - true when no element of an array-valued variable equals `value`.

Conditions group under `all` or `any`, and the groups nest:

```json
"if": { "any": [
  { "kind": "lvar", "address": "S_OH_EXT_LT_NAV_LOGO", "valueType": "int", "operator": "equal", "value": 1 },
  { "kind": "lvar", "address": "S_OH_EXT_LT_NAV_LOGO", "valueType": "int", "operator": "equal", "value": 2 }
] }
```

If the simulator never reports a variable, it resolves to `undefined`, and no
operator matches that. The branch just falls through to the next one.

#### What a branch emits

`action.value` takes one of:

- `true` or `false` - the feature is on or off.
- `"ignore"` - emit nothing and leave the feature to a lower priority config.
- `{ "fromFact": { ... } }` - emit the variable's own value instead of a
  boolean. This is how `Flaps` reports its detent.
- a numeric literal, such as `0` - emit that number.
- `{ "fromFacts": [ ... ] }` - a list of variables, emitted as an array in list
  order (one per engine). A variable the sim does not report gives `null` at its
  position, so engine indexes stay aligned. Bool variables pass through as a
  bool array.

`fromFact` and `fromFacts` take two optional transform fields next to them:

- `scale` - multiply the raw value (each element, for an array).
- `clamp` - `[min, max]`, applied after `scale`.

```json
{ "value": { "fromFact": { "kind": "offset", "address": "0x0BD0", "valueType": "int" }, "scale": 0.0000610388, "clamp": [0, 1] } }
```

An action can also set `provenance`: `deployed` (the default) when the value
reports the actual surface or reverser position, or `commanded` when it only
reports the pilot's lever or command, as FSUIPC does for reversers.

An action can also name a `mappings` table through `mapping`, which turns the
emitted value into a label.

### `mappings`

These are named lookup tables, each one a list of `{ value, label }` rows, used
to turn a raw value into something readable.

```json
"mappings": {
  "flapNames": [
    { "value": 0, "label": "UP" },
    { "value": 1, "label": "CONF 1" },
    { "value": 5, "label": "FULL" }
  ]
}
```

`flapNames` is the one the client looks up by name, to label flap detents. When
a config doesn't define it, the client falls back to `_default_flaps.json`,
which matches the aircraft's ICAO against a pattern and covers whole families
at once.

### `disabled`

This switches a feature off completely, which is worth doing when an aircraft
reports one badly enough that no rule can be trusted.

```json
"disabled": { "BeaconLights": true }
```

A disabled feature emits nothing. Unlike `"ignore"`, it doesn't hand the
feature down to a lower priority config either.

### Priority

When two configs match the same aircraft, both stay loaded, and the winner is
worked out separately for each feature using `meta.priority`. A config that
leaves a feature out, or emits `"ignore"` for it, passes that feature to the
next config down.

Partial overrides fall out of that. Say a priority 1 config defines
`BeaconLights` and `LandingLights`, and a priority 10 config defines only
`LandingLights`. The client ends up using the priority 10 landing lights and
the priority 1 beacon lights.

A VA's own configs work the same way. They sit alongside the shipped library
rather than replacing it, so overriding one feature of one aircraft leaves
everything else alone.

### Targeting MSFS versions

`meta.sim` takes three MSFS values:

- `msfs` - both 2020 and 2024
- `msfs20` - 2020 only
- `msfs24` - 2024 only

---

## Flight Thresholds (`settings.json`)

The client decides when a takeoff roll has started, when a landing roll has
stopped, when a climb is a go-around, and so on, from a set of numeric
thresholds. The full set of values is compiled into the client. Everything
else is a sparse layer that lists only the keys it changes. When a flight
starts, the client resolves one set of values and freezes it for that flight,
so a change takes effect on the next flight without a client release.

### Layers

Last one wins, key by key:

1. **Client built-in values** - every key (the Keys table below).
2. **Replane `thresholds` namespace** - global tuning, `{}` until something is
   tuned.
3. **This repo's `settings.json`** - the aircraft-class overrides, published on
   their own like the aircraft configs, as `configs/settings-latest.json`, and
   downloaded from `acars.settings_url`. When it cannot be fetched, the client
   uses its own copy of the class overrides.
4. **The airline's `settings/thresholds.jsonc` (or `.json`)** in its config
   zip, found through `config.settings.path` in the zip's `package.json`.
   Airlines tune thresholds here.

### Layout

- `src/settings/overrides/*.json` or `*.jsonc` - one class override per file:
  a selector plus only the keys it changes.
- `src/settings/thresholds.jsonc` - the airline template. It ships in the zip
  as `settings/thresholds.jsonc` and changes nothing until an airline adds
  values to it.
- `src/types/settings.schema.json` - the JSON schema. Every key's meaning,
  built-in value and allowed range is documented there, and the build
  validates every source file against it.

Comments and trailing commas are allowed in the sources, so give each file a
short comment. The build (`npm run build`) parses them, validates them and
writes plain JSON (version 2) to `artifacts/settings.json`:

```jsonc
{
  "version": 2,
  "overrides": [
    { "class": "general-aviation", "values": { "phases": { "approach": { "descentFpm": 150 } } } },
    { "class": "helicopter", "values": { "phases": { "approach": { "descentFpm": 150 }, "circuit": { "rollEnabled": false } } } }
  ]
}
```

Every layer document has the same shape. `version` is required and must be 2;
`values` (applies to every aircraft) and `overrides` are both optional.

### Groups

| Group | What it covers |
|---|---|
| `phases.taxiIn` | When the aircraft counts as taxiing in after landing |
| `phases.takeoff` | Takeoff roll start, and the helicopter lift-off confirmation |
| `phases.approach` | The sustained descent that starts the Approach phase |
| `phases.landed` | Touchdown plausibility and ground-contact detection |
| `phases.landed.bounce` | When a hop after touchdown counts as a bounce |
| `phases.goAround` | The go-around consensus votes |
| `phases.circuit` | Multiple landings: lift-off, roll and stop detection for touch-and-go circuits |
| `airportLookup` | When and how far the nearby-airport lookup searches for an approach field |
| `recording` | Raw-telemetry capture policy |

The `phases` groups are named after the client's flight phases (`PirepState`),
`goAround` after its go-around event.

### Precedence inside one document

`values` <- `class` overrides <- `icao` overrides, merged key-by-key: every
matching `class` override in file order, then every matching `icao` override in
file order. Each layer only replaces the keys it lists. If two overrides for the
same layer set the same key, the one later in the file (or whose file sorts
later) wins.

### Keys

The built-in value is the one compiled into the client; every layer only
changes it.

| Key | Built-in | What it does |
|---|---|---|
| `phases.taxiIn.maxKt` | 35 | Ground speed (kt) below which the aircraft is taxiing in after landing |
| `phases.takeoff.runwayKt` | 40 | Ground speed (kt) that starts the takeoff roll on a known runway |
| `phases.takeoff.anywhereKt` | 80 | Ground speed (kt) that starts the takeoff roll anywhere |
| `phases.takeoff.heliLiftoffSec` | 2 | Helicopter departure: airborne at least this long (s) |
| `phases.takeoff.heliLiftoffAglFt` | 10 | Helicopter departure: gain (ft) over the ground baseline |
| `phases.approach.descentFpm` | 300 | Sustained descent rate (fpm, positive) that starts the Approach phase |
| `phases.landed.touchdownMaxRadioAltFt` | 100 | On-ground sample with radio altitude above this (ft) and no gear contact is not a touchdown; unknown telemetry stays plausible |
| `phases.landed.contactLandedSec` | 1 | Contact held this long (s) means the aircraft is on the ground |
| `phases.landed.holdSec` | 2 | Touchdown values become final this long (s) after the contact |
| `phases.landed.airborneDwellSec` | 0.25 | On-ground false this long (s), with the gain, means airborne |
| `phases.landed.airborneGainFt` | 0.8 | Radio-altitude gain (ft) needed together with the dwell |
| `phases.landed.airborneGainTimeoutSec` | 1 | On-ground false this long (s) means airborne whatever the gain |
| `phases.landed.sinkRateWindowSec` | 1 | Touchdown sink rate is the mean vertical speed over this window (s) |
| `phases.landed.oneWheelSec` | 0.5 | One main wheel down this long (s) before the other marks a one-wheel touchdown |
| `phases.landed.bounce.minGainFt` | 2 | A hop after touchdown that rises at least this much (ft) is a bounce |
| `phases.landed.bounce.minAirborneSec` | 1 | A hop after touchdown airborne at least this long (s) is a bounce |
| `phases.landed.bounce.maxSec` | 20 | A span this long (s) is an extended float; ground held this long closes bounce attribution |
| `phases.goAround.climbGainFt` | 300 | Barometric climb (ft) above the approach low point that casts the gain vote |
| `phases.goAround.vsFpm` | 300 | Mean vertical speed (fpm) that casts the climbing vote |
| `phases.goAround.climbSeconds` | 3 | Window (s) the climbing vote is averaged over |
| `phases.goAround.sustainSec` | 1 | How long (s) each counted vote must hold |
| `phases.goAround.fieldCeilingFt` | 1000 | The low point must be at most this far (ft) above the field |
| `phases.goAround.minGainFt` | 100 | Barometric gain (ft) from the low point that is always required |
| `phases.goAround.n1RisePct` | 10 | N1 points above the trailing baseline that cast the thrust vote |
| `phases.goAround.throttleRisePct` | 20 | Throttle points above the trailing baseline that cast the thrust vote |
| `phases.goAround.thrustBaselineSeconds` | 30 | Trailing window (s) whose lowest N1 and throttle are the thrust baseline |
| `phases.circuit.liftoffSeconds` | 3 | Seconds airborne after a touchdown for the lift-off to start a new circuit |
| `phases.circuit.liftoffAglFt` | 50 | AGL (ft) reached after a touchdown for the lift-off to start a new circuit |
| `phases.circuit.liftoffMinVsFpm` | -200 | Mean VS (fpm) over the lift-off window must be at or above this; a fall off an obstacle is not a departure |
| `phases.circuit.stopKt` | 10 | Ground speed (kt) below which a landing roll is stopped |
| `phases.circuit.rollEnabled` | `true` | Whether a re-acceleration on the runway can start a new circuit (`false` for helicopters) |
| `phases.circuit.rollMinKt` | 50 | Ground speed (kt) floor for a roll attempt; above `phases.takeoff.runwayKt` on purpose so an expedited runway exit does not qualify |
| `phases.circuit.rollAccelKt` | 20 | Ground speed gain (kt) over `phases.circuit.rollWindowSeconds` that declares a roll attempt |
| `phases.circuit.rollWindowSeconds` | 5 | Sim-clock window (s) for `phases.circuit.rollAccelKt`; at least 3 samples, a gap over 2 s resets it |
| `phases.circuit.rollHeadingToleranceDeg` | 20 | Heading drift (deg) allowed during the roll window |
| `phases.circuit.departureAfterReverserPenalty` | 25 | Points off the landing category (0-100) when the aircraft departs again after using reversers |
| `airportLookup.ceilingAglFt` | 3000 | At or below this AGL (ft) a nearby-airport lookup may start |
| `airportLookup.descentCeilingAglFt` | 10000 | A sustained descent starts a lookup only below this AGL (ft) |
| `airportLookup.rangeNm` | 10 | The lookup takes the nearest airport with runways within this range (NM) |
| `airportLookup.approachRangeNm` | 20 | Range (NM) once the Approach phase has started |
| `recording.lowFullRateMaxSec` | 600 | Full-rate recording below 2,000 ft AGL lasts at most this long (s) per low leg |

### Adding an override

Create one file under `src/settings/overrides/`. It needs `values` and at
least one selector:

- `class` - `fixed-wing`, `helicopter` or `general-aviation`.
- `icao` - a list of ICAO type designators. Matching ignores case.

```jsonc filename="src/settings/overrides/light-singles.jsonc"
// Light singles fly a tighter, lower circuit.
{
  "icao": ["C172", "C152", "PA28"],
  "values": {
    "phases": { "circuit": { "liftoffAglFt": 30 } }
  }
}
```

Only list the keys you are changing, nested in their groups. The build rejects
a group or key that is not in the schema, a value outside its range and an
override with no selector, so run `npm run build` before opening a pull
request. Files are applied in filename order, so name a file so it sorts after
the ones it should beat.

### Airline tuning

An airline edits `settings/thresholds.jsonc` in its own config zip, with the
same shape:

```jsonc filename="settings/thresholds.jsonc"
{
  "version": 2,
  "values": { "phases": { "taxiIn": { "maxKt": 30 } } },
  "overrides": [
    { "icao": ["C172"], "values": { "phases": { "approach": { "descentFpm": 200 } } } }
  ]
}
```

A file that does not parse is skipped whole and logged. An unknown key is
logged and ignored; a value outside its range is logged and reverts to the
built-in value.

---

## Rules Configuration

A rule looks like this:

```typescript
export default class ExampleRule implements Rule {
    meta: Meta = {
        id: 'ExampleRule',
        name: 'An Example Rule',
        enabled: true,
        message: 'A example rule!',
        states: [],
        repeatable: false,
        cooldown: 60,
        max_count: 3,
    }

    violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    }
}
```

A rule also has several components:

- Needs to implement the `Rule` interface
- Has a `meta`, section, hich gives some general information about the
  configuration:
  - `id` - A unique ID for this rule
  - `name` - a name for this rule, it's used as the reference
  - `enabled`
  - `message` - a default message when the rule is violated
  - `states` - a list of `PirepState` of when this rule is to be run
  - `repeatable` - if it can be violated multiple times
  - `cooldown` - The amount of time, in seconds, between violations
  - `max_count` - if it's repeatable, how many times it can maximally be
    vioalted
- A `violated()` method, which returns a `RuleValue`
  - Passed the `pirep` and the `data` (`Telemetry` type)

### Looking at aircraft feature states

To lookup the state of an aircraft feature, look at the `data.Features`
dictionary. The following
rule is evaluated during pushback, and checks that the battery is on:

```typescript
import { AircraftFeature, PirepState } from './defs'

export default class BatteryOnDuringPushback implements Rule {
    meta: Meta = {
        id: 'ExampleRule',
        name: 'An Example Rule',
        enabled: true,
        message: 'A example rule!',
        states: [PirepState.Pushback],
        repeatable: false,
        cooldown: 60,
        max_count: 3,
    }

    violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
            // First check that the battery is declared as part of the aircraft's feature set
        if (AircraftFeature.Battery in data.features
            // And then check its value to see if it's on or off
            && data.features[AircraftFeature.Battery] == false) {
            return ['The battery must be on during pushback']
        }
    }
}
```

### Returning a `RuleValue`

The return value has multiple possible values, sending on

```typescript
export type RuleValue = undefined | boolean | [string?, number?]
```

If a rule is passing/hasn't been violated:

```typescript
return
return false
```

If a rule has been violated:

```typescript
return true
```

Or, if you want to return a custom message:

```typescript
return ['message']
```

Or, if you want to return a message and points:

```typescript
return ['message', points]
```

If you want to return just the points, you can return:

```typescript
return ['', points]
```

`points` and `message` are optional - if omitted, they're pulled from the `meta`
block

### Helper Methods


---

# Callback scripts

The CallbackHook interface provides a framework for creating scripts that
interact with the ACARS system. This document outlines the three core methods
that every script implementing this interface must provide.

```typescript file=example.ts
import { PirepState } from '../defs'
import { CallbackHook, Meta } from '../types/callback'
import { Pirep, Telemetry } from '../types/types'

/**
 * This is an example script. It's not very useful, but it's a good example of
 * how to write a script and some of the functionality.
 */
export default class ExampleScript implements CallbackHook {
  meta: Meta = {
    id: 'example_script',
    name: 'Example Script',
    enabled: false,
  }

  setup() {
    Acars.Set('above_1k', false)
    Acars.Set('launched_message', false)
  }

  /**
   * This once a second.
   * @param pirep
   * @param data
   */
  run(pirep: Pirep, data: Telemetry): void {

    Acars.SetPirepField('Loaded', 'True')
    Acars.AddPirepLogOnce('loaded_msg', 'Example script loaded')

    // Example of setting a flag to check later on
    if (data.groundAltitude.Feet > 1000) {
      Acars.Set('above_1k', true)
      Acars.SetPirepField('Above 1000 feet', 'True')
    }

    /*
     * Just a silly example, if they crossed above 1000 feet and then they went
     * back below it, send a message about that
     */
    if (Acars.Get('above_1k') === true && data.groundAltitude.Feet < 1000) {
      Acars.AddPirepLog("Went above 1000', now back down")
    }
  }

  /**
   * Called on phase changes
   */
  phaseChange(
    pirep: Pirep,
    data: Telemetry,
    newPhase: PirepState,
    oldPhase: PirepState,
  ) {
    Acars.AddPirepLog(`Phase changed from ${oldPhase} to ${newPhase}`)

    if (newPhase == PirepState.Pushback) {
      Acars.PlayAudio('departure.mp3')
    }
  }
}

```

## Core Methods

### 1. `setup()`

#### Purpose
The method is called once when your script is initially loaded. This is the
ideal place to initialize any variables, state, or settings that your script
will use.

#### When It Runs
- Executes exactly once at script initialization
- Runs before any other methods in your script

#### Example Use Cases
- Setting initial state values using `Acars.Set()`
- Initializing flags or counters
- Setting up any pre-conditions required by your script

#### Example
``` typescript
setup() {
  Acars.Set('above_1k', false)
  Acars.Set('launched_message', false)
}
```
### 2. `run()`
``` typescript
run(pirep: Pirep, data: Telemetry, previousData?: Telemetry): void
```

#### Purpose
The `run()` method is the heart of your script's functionality. It executes at regular intervals, allowing you to continuously monitor flight conditions and perform actions based on that data.

#### When It Runs
- Executes approximately every 500ms (twice per second)
- Continues to run throughout the duration of the flight

#### Parameters
- : Contains information about the current Pilot Report `pirep`
- : Contains the current telemetry data including altitude, speed, position, etc. `data`
- (optional): Contains telemetry data from the previous execution `previousData`

#### Example Use Cases
- Monitoring altitude, speed, or position changes
- Triggering events based on specific flight conditions
- Updating flight logs
- Playing audio cues at appropriate times

```
### 3. `phaseChange()`
``` typescript
phaseChange(pirep: Pirep, data: Telemetry, newPhase: PirepState, oldPhase: PirepState): void
```

#### Purpose
The `phaseChange()` method is triggered whenever the flight transitions between different operational phases (such as boarding, taxiing, in-flight, approach, etc.).

#### When It Runs
- Executes whenever the flight phase/state changes
- May run multiple times during a flight, but only at phase transition points

#### Parameters
- : Contains information about the current Pilot Report `pirep`
- : Contains the current telemetry data at the moment of phase change `data`
- : The PirepState being transitioned to `newPhase`
- : The PirepState being transitioned from `oldPhase`

#### Example Use Cases
- Logging phase transitions
- Playing specific audio for different flight phases
- Performing checks or verification at critical flight stages
- Triggering phase-specific behaviors or requirements


#### Notes

- Don't call any timer functions here, they won't properly trigger

#### Example
``` typescript
phaseChange(pirep: Pirep, data: Telemetry, newPhase: PirepState, oldPhase: PirepState) {
  Acars.AddPirepLog(`Phase changed from ${oldPhase} to ${newPhase}`)

  if (newPhase === PirepState.TaxiOut) {
    Acars.PlayAudio('departure.mp3')
  }

  if (newPhase === PirepState.Enroute) {
    Acars.SetPirepField('Reached Cruise', 'True')
  }
}
```
## Implementing Your Own Script

To create your own script, implement all three methods of the CallbackHook interface, and don't forget to define the required property with a unique ID and name for your script in the `meta` block

``` typescript
export default class MyScript implements CallbackHook {
  meta: Meta = {
    id: 'my_unique_script_id',
    name: 'My Script Name',
    enabled: true,
  }

  setup() {
    // Initialize your script
  }

  run(pirep: Pirep, data: Telemetry, previousData?: Telemetry) {
    // Regular processing
  }

  phaseChange(pirep: Pirep, data: Telemetry, newPhase: PirepState, oldPhase: PirepState) {
    // Handle phase transitions
  }
}
```

### Sounds

Place your sounds (`mp3` or `wav`) format in the `src/sounds` directory (create
it if it doesn't exist). When you call `Acars.PlayAudio`, it will look in this
directory for them.
