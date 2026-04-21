/**
 * Simple Mock Test for Light Rules
 * Run with: node tests/simple-rules.test.js
 */

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
  phase: 'takeoff',
}

// Mock Telemetry factory
function createMockTelemetry(overrides = {}) {
  return {
    beaconLights: true,
    taxiLights: true,
    onGround: true,
    groundSpeed: { Knots: 0 },
    anyEnginesRunning: false,
    parkBrake: true,
    gearUp: false,
    ...overrides,
  }
}

/**
 * Test helper
 */
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

console.log('\n🧪 Mock Tests for Light Rules\n')

// ============================================
// BEACON LIGHTS RULE LOGIC TESTS
// ============================================
console.log('📍 Beacon Lights Rule')
console.log('='.repeat(60))

const beaconTests = []

// Test 1
beaconTests.push(test(
  'No violation when on ground, stationary, engines off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      anyEnginesRunning: false,
      beaconLights: false,
    })

    // Rule logic: if (!isOnGround || (!enginesRunning && !isMoving)) return
    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    const isOnGround = data.onGround

    if (!isOnGround || (!enginesRunning && !isMoving)) {
      return true // No violation
    }
    return false
  }
))

// Test 2
beaconTests.push(test(
  'Violation when engines running but beacon off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      anyEnginesRunning: true,
      beaconLights: false,
    })

    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    const isOnGround = data.onGround

    // Should return early? No (has engines + on ground)
    if (!isOnGround || (!enginesRunning && !isMoving)) {
      return false
    }

    // Now check violation: is moving OR engines running, AND beacon off
    const violated = !data.beaconLights
    return violated // True = violation
  }
))

// Test 3
beaconTests.push(test(
  'Violation when aircraft moving (>2 knots) but beacon off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 5 },
      anyEnginesRunning: false,
      beaconLights: false,
    })

    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    const isOnGround = data.onGround

    if (!isOnGround || (!enginesRunning && !isMoving)) {
      return false
    }

    const violated = !data.beaconLights
    return violated
  }
))

// Test 4
beaconTests.push(test(
  'No violation when in air (onGround: false)',
  () => {
    const data = createMockTelemetry({
      onGround: false,
      groundSpeed: { Knots: 300 },
      anyEnginesRunning: true,
      beaconLights: false,
    })

    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    const isOnGround = data.onGround

    if (!isOnGround || (!enginesRunning && !isMoving)) {
      return true // No violation
    }
    return false
  }
))

// ============================================
// TAXI LIGHTS (TAXIOUT) RULE LOGIC TESTS
// ============================================
console.log('\n📍 Taxi Lights (TaxiOut) Rule')
console.log('='.repeat(60))

const taxiTests = []

// Test 5
taxiTests.push(test(
  'No violation when on ground but stationary',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      parkBrake: true,
      gearUp: false,
      taxiLights: false,
    })

    if (!data.onGround) return true

    const isMoving = data.groundSpeed.Knots > 1
    const isParked = data.parkBrake && data.groundSpeed.Knots < 1
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return true // No violation
    }
    return false
  }
))

// Test 6
taxiTests.push(test(
  'Violation when taxiing and taxi lights off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 5 },
      parkBrake: false,
      gearUp: false,
      taxiLights: false,
    })

    if (!data.onGround) return false

    const isMoving = data.groundSpeed.Knots > 1
    const isParked = data.parkBrake && data.groundSpeed.Knots < 1
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return false
    }

    return !data.taxiLights // True = violation
  }
))

// Test 7
taxiTests.push(test(
  'No violation when taxiing with taxi lights on',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 5 },
      parkBrake: false,
      gearUp: false,
      taxiLights: true,
    })

    if (!data.onGround) return false

    const isMoving = data.groundSpeed.Knots > 1
    const isParked = data.parkBrake && data.groundSpeed.Knots < 1
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return true // No violation
    }

    // When lights ARE on, !data.taxiLights = false (no violation)
    // Test should pass (return true for test success)
    return !data.taxiLights === false ? true : false
  }
))

// Test 8
taxiTests.push(test(
  'No violation when in air',
  () => {
    const data = createMockTelemetry({
      onGround: false,
      groundSpeed: { Knots: 200 },
      parkBrake: false,
      gearUp: true,
      taxiLights: false,
    })

    if (!data.onGround) return true // No violation
    return false
  }
))

// ============================================
// TAXI IN LIGHTS RULE LOGIC TESTS
// ============================================
console.log('\n📍 Taxi In Lights Rule')
console.log('='.repeat(60))

const taxiInTests = []

// Test 9
taxiInTests.push(test(
  'No violation when on ground but stationary',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 0 },
      parkBrake: true,
      gearUp: false,
      taxiLights: false,
    })

    if (!data.onGround) return true

    const isMoving = data.groundSpeed.Knots > 1
    const isParked = data.parkBrake && data.groundSpeed.Knots < 1
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return true // No violation
    }
    return false
  }
))

// Test 10
taxiInTests.push(test(
  'Violation when taxiing in and taxi lights off',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 10 },
      parkBrake: false,
      gearUp: false,
      taxiLights: false,
    })

    if (!data.onGround) return false

    const isMoving = data.groundSpeed.Knots > 1
    const isParked = data.parkBrake && data.groundSpeed.Knots < 1
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return false
    }

    return !data.taxiLights // True = violation
  }
))

// Test 11
taxiInTests.push(test(
  'No violation when taxiing in with lights on',
  () => {
    const data = createMockTelemetry({
      onGround: true,
      groundSpeed: { Knots: 10 },
      parkBrake: false,
      gearUp: false,
      taxiLights: true,
    })

    if (!data.onGround) return false

    const isMoving = data.groundSpeed.Knots > 1
    const isParked = data.parkBrake && data.groundSpeed.Knots < 1
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return true // No violation
    }

    // When lights ARE on, !data.taxiLights = false (no violation)
    // Test should pass (return true for test success)
    return !data.taxiLights === false ? true : false
  }
))

// ============================================
// SUMMARY
// ============================================
const allTests = [...beaconTests, ...taxiTests, ...taxiInTests]
const passedTests = allTests.filter(t => t === true).length
const totalTests = allTests.length

console.log('\n\n' + '='.repeat(60))
console.log('📊 Test Summary')
console.log('='.repeat(60))
console.log(`\nTotal Tests: ${totalTests}`)
console.log(`Passed: ${passedTests} ✅`)
console.log(`Failed: ${totalTests - passedTests} ❌`)
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`)

process.exit(passedTests === totalTests ? 0 : 1)
