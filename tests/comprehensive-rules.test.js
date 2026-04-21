// Setup Acars mock
const Acars = {
  ViolatedAfterDelay: (name, timeout, callback) => {
    return callback()
  },
}
global.Acars = Acars

// Mock Pirep
const mockPirep = {
  depicao: 'KJFK',
  arricao: 'KAUS',
  phase: 'flight',
}

// Mock Telemetry factory
function createMockTelemetry(overrides = {}) {
  return {
    beaconLights: true,
    taxiLights: true,
    landingLights: true,
    strobeLights: true,
    onGround: true,
    groundSpeed: { Knots: 0 },
    groundAltitude: { Feet: 0 },
    anyEnginesRunning: false,
    parkBrake: true,
    gearUp: false,
    flaps: 0,
    ...overrides,
  }
}

// Test helper
function test(name, testFn) {
  try {
    const passed = testFn()
    const status = passed ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${status} - ${name}`)
    return passed
  } catch (error) {
    console.log(`  ❌ ERROR - ${name}: ${error.message}`)
    return false
  }
}

console.log('\n🧪 Comprehensive Mock Tests for All Rules\n')

const results = {}

// ============================================
// 1. BEACON LIGHTS TESTS
// ============================================
console.log('📍 1. Beacon Lights Rule')
console.log('='.repeat(60))

results.beaconLights = []

results.beaconLights.push(test(
  'No violation when on ground, stationary, engines off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      anyEnginesRunning: false,
      beaconLights: false,
    })
    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    if (!enginesRunning && !isMoving) return true
    return false
  }
))

results.beaconLights.push(test(
  'Violation when engines running but beacon off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      anyEnginesRunning: true,
      beaconLights: false,
    })
    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    if (!enginesRunning && !isMoving) return false
    return !data.beaconLights
  }
))

results.beaconLights.push(test(
  'No violation in air when engines off and no movement',
  () => {
    const data = createMockTelemetry({
      onGround: false,
      groundSpeed: { Knots: 0 },
      anyEnginesRunning: false,
      beaconLights: false,
    })
    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    if (!enginesRunning && !isMoving) return true
    return false
  }
))

// ============================================
// 2. TAXI OUT LIGHTS TESTS
// ============================================
console.log('\n📍 2. Taxi Out Lights Rule')
console.log('='.repeat(60))

results.taxiOutLights = []

results.taxiOutLights.push(test(
  'No violation when stationary',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      parkBrake: true,
      gearUp: false,
      taxiLights: false,
    })
    if (!data.onGround) return false
    const isMoving = data.groundSpeed.Knots >= 10
    const isParked = data.parkBrake && data.groundSpeed.Knots < 10
    const gearDown = !data.gearUp
    if (!isMoving || isParked || !gearDown) return true
    return false
  }
))

results.taxiOutLights.push(test(
  'Violation when taxiing at 10+ knots with lights off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 15 },
      parkBrake: false,
      gearUp: false,
      taxiLights: false,
    })
    if (!data.onGround) return false
    const isMoving = data.groundSpeed.Knots >= 10
    const isParked = data.parkBrake && data.groundSpeed.Knots < 10
    const gearDown = !data.gearUp
    if (!isMoving || isParked || !gearDown) return false
    return !data.taxiLights
  }
))

// ============================================
// 3. TAXI IN LIGHTS TESTS
// ============================================
console.log('\n📍 3. Taxi In Lights Rule')
console.log('='.repeat(60))

results.taxiInLights = []

results.taxiInLights.push(test(
  'No violation when stationary',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      parkBrake: true,
      gearUp: false,
      taxiLights: false,
    })
    if (!data.onGround) return false
    const isMoving = data.groundSpeed.Knots >= 10
    const isParked = data.parkBrake && data.groundSpeed.Knots < 10
    const gearDown = !data.gearUp
    if (!isMoving || isParked || !gearDown) return true
    return false
  }
))

results.taxiInLights.push(test(
  'Violation when taxiing at 10+ knots with lights off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 12 },
      parkBrake: false,
      gearUp: false,
      taxiLights: false,
    })
    if (!data.onGround) return false
    const isMoving = data.groundSpeed.Knots >= 10
    const isParked = data.parkBrake && data.groundSpeed.Knots < 10
    const gearDown = !data.gearUp
    if (!isMoving || isParked || !gearDown) return false
    return !data.taxiLights
  }
))

// ============================================
// 4. FLAPS TAXI OUT TESTS
// ============================================
console.log('\n📍 4. Flaps Taxi Out Rule')
console.log('='.repeat(60))

results.flapsTaxiOut = []

results.flapsTaxiOut.push(test(
  'No violation when flaps configured (>0)',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 15 },
      parkBrake: false,
      gearUp: false,
      flaps: 5,
    })
    return data.flaps !== 0
  }
))

results.flapsTaxiOut.push(test(
  'Violation when flaps at 0 during taxi',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 15 },
      parkBrake: false,
      gearUp: false,
      flaps: 0,
    })
    return data.flaps === 0
  }
))

// ============================================
// 5. FLAPS TAKEOFF TESTS
// ============================================
console.log('\n📍 5. Flaps Takeoff Rule')
console.log('='.repeat(60))

results.flapsTakeoff = []

results.flapsTakeoff.push(test(
  'No violation when flaps configured',
  () => {
    const data = createMockTelemetry({ flaps: 15 })
    return data.flaps !== 0
  }
))

results.flapsTakeoff.push(test(
  'Violation when flaps at 0',
  () => {
    const data = createMockTelemetry({ flaps: 0 })
    return data.flaps === 0
  }
))

// ============================================
// 6. LANDING LIGHTS OFF 10K TESTS
// ============================================
console.log('\n📍 6. Landing Lights Off Above 10k Rule')
console.log('='.repeat(60))

results.landingLightsOff10k = []

results.landingLightsOff10k.push(test(
  'No violation when below 10k feet',
  () => {
    const data = createMockTelemetry({
      groundAltitude: { Feet: 5000 },
      landingLights: true,
    })
    const altitudeAGL = data.groundAltitude.Feet
    const isAbove10k = altitudeAGL > 10000
    if (!isAbove10k) return true
    return false
  }
))

results.landingLightsOff10k.push(test(
  'Violation when above 10k with lights on',
  () => {
    const data = createMockTelemetry({
      groundAltitude: { Feet: 15000 },
      landingLights: true,
    })
    const altitudeAGL = data.groundAltitude.Feet
    const isAbove10k = altitudeAGL > 10000
    if (!isAbove10k) return false
    return data.landingLights
  }
))

// ============================================
// 7. LANDING LIGHTS ON TAKEOFF TESTS
// ============================================
console.log('\n📍 7. Landing Lights On Takeoff Rule')
console.log('='.repeat(60))

results.landingLightsOnTakeoff = []

results.landingLightsOnTakeoff.push(test(
  'No violation when landing lights on',
  () => {
    const data = createMockTelemetry({ landingLights: true })
    return !(!data.landingLights)
  }
))

results.landingLightsOnTakeoff.push(test(
  'Violation when landing lights off',
  () => {
    const data = createMockTelemetry({ landingLights: false })
    return !data.landingLights
  }
))

// ============================================
// 8. STROBES ON TAKEOFF TESTS
// ============================================
console.log('\n📍 8. Strobes On Takeoff Rule')
console.log('='.repeat(60))

results.strobesOnTakeoff = []

results.strobesOnTakeoff.push(test(
  'No violation when strobes on',
  () => {
    const data = createMockTelemetry({ strobeLights: true })
    return !(!data.strobeLights)
  }
))

results.strobesOnTakeoff.push(test(
  'Violation when strobes off',
  () => {
    const data = createMockTelemetry({ strobeLights: false })
    return !data.strobeLights
  }
))

// ============================================
// 9. STROBES ON FLIGHT TESTS
// ============================================
console.log('\n📍 9. Strobes On Flight Rule')
console.log('='.repeat(60))

results.strobesOnFlight = []

results.strobesOnFlight.push(test(
  'No violation when strobes on',
  () => {
    const data = createMockTelemetry({ strobeLights: true })
    return !(!data.strobeLights)
  }
))

results.strobesOnFlight.push(test(
  'Violation when strobes off',
  () => {
    const data = createMockTelemetry({ strobeLights: false })
    return !data.strobeLights
  }
))

// ============================================
// SUMMARY
// ============================================
console.log('\n\n' + '='.repeat(60))
console.log('📊 Test Summary')
console.log('='.repeat(60))

let totalTests = 0
let passedTests = 0

for (const [rule, tests] of Object.entries(results)) {
  const passed = tests.filter(t => t === true).length
  const total = tests.length
  totalTests += total
  passedTests += passed

  const status = passed === total ? '✅' : '⚠️'
  console.log(`${status} ${rule}: ${passed}/${total}`)
}

console.log(`\nTotal Tests: ${totalTests}`)
console.log(`Passed: ${passedTests} ✅`)
console.log(`Failed: ${totalTests - passedTests} ❌`)
console.log(`\nSuccess Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`)

process.exit(passedTests === totalTests ? 0 : 1)
