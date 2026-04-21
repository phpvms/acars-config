import { createMocks, createMockPirep } from './mocks.js'

// Setup mocks
createMocks()

// Import the compiled rules
import BeaconLights from '../dist/rules/beacon_lights.js'
import TaxiLights from '../dist/rules/taxi_lights.js'
import TaxiInLights from '../dist/rules/taxi_in_lights.js'

/**
 * Create a mock Telemetry object
 */
function createMockTelemetry(overrides = {}) {
  return {
    beaconLights: true,
    taxiLights: true,
    navigationLights: true,
    landingLights: true,
    strobeLights: true,
    logoLight: true,
    wingLights: true,
    onGround: true,
    groundSpeed: { Knots: 0 },
    anyEnginesRunning: false,
    allEnginesRunning: false,
    parkBrake: true,
    gearUp: false,
    n1Percent: 0,
    throttlePct: 0,
    paused: false,
    replay: false,
    slewActive: false,
    ...overrides,
  }
}

/**
 * Test suite for light rules
 */
console.log('🧪 Starting Mock Tests for Light Rules\n')

// ============================================
// BEACON LIGHTS TESTS
// ============================================
console.log('📍 Testing: Beacon Lights Rule')
console.log('='.repeat(50))

const beaconRule = new BeaconLights.default()
const mockPirep = createMockPirep()

const tests = []

// Test 1: No violation when on ground, not moving, engines off
console.log('\n✓ Test 1: No violation - on ground, stationary, engines off')
const result1 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  anyEnginesRunning: false,
  beaconLights: false,
}))
const pass1 = result1 === undefined
console.log(`  Result: ${pass1 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result1})`)
tests.push(pass1)

// Test 2: Violation when engines running but beacon off
console.log('\n✓ Test 2: Violation - engines running, beacon OFF')
const result2 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  anyEnginesRunning: true,
  beaconLights: false,
}))
const pass2 = result2 === true
console.log(`  Result: ${pass2 ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result2})`)
tests.push(pass2)

// Test 3: Violation when moving but beacon off
console.log('\n✓ Test 3: Violation - aircraft moving, beacon OFF')
const result3 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 5 },
  anyEnginesRunning: false,
  beaconLights: false,
}))
const pass3 = result3 === true
console.log(`  Result: ${pass3 ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result3})`)
tests.push(pass3)

// Test 4: No violation when in air
console.log('\n✓ Test 4: No violation - in air (onGround: false)')
const result4 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: false,
  groundSpeed: { Knots: 300 },
  anyEnginesRunning: true,
  beaconLights: false,
}))
const pass4 = result4 === undefined
console.log(`  Result: ${pass4 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result4})`)
tests.push(pass4)

// ============================================
// TAXI LIGHTS (TAXIOUT) TESTS
// ============================================
console.log('\n\n📍 Testing: Taxi Lights (TaxiOut) Rule')
console.log('='.repeat(50))

const taxiRule = new TaxiLights.default()

// Test 5: No violation when on ground but stationary
console.log('\n✓ Test 5: No violation - on ground, stationary')
const result5 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  parkBrake: true,
  gearUp: false,
  taxiLights: false,
}))
const pass5 = result5 === undefined
console.log(`  Result: ${pass5 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result5})`)
tests.push(pass5)

// Test 6: Violation when taxiing and lights off
console.log('\n✓ Test 6: Violation - taxiing, taxi lights OFF')
const result6 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 5 },
  parkBrake: false,
  gearUp: false,
  taxiLights: false,
}))
const pass6 = result6 === true
console.log(`  Result: ${pass6 ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result6})`)
tests.push(pass6)

// Test 7: No violation when taxiing with lights ON
console.log('\n✓ Test 7: No violation - taxiing with taxi lights ON')
const result7 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 5 },
  parkBrake: false,
  gearUp: false,
  taxiLights: true,
}))
const pass7 = result7 === undefined
console.log(`  Result: ${pass7 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result7})`)
tests.push(pass7)

// Test 8: No violation when in air
console.log('\n✓ Test 8: No violation - in air (onGround: false)')
const result8 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: false,
  groundSpeed: { Knots: 200 },
  parkBrake: false,
  gearUp: true,
  taxiLights: false,
}))
const pass8 = result8 === undefined
console.log(`  Result: ${pass8 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result8})`)
tests.push(pass8)

// ============================================
// TAXI IN LIGHTS TESTS
// ============================================
console.log('\n\n📍 Testing: Taxi In Lights Rule')
console.log('='.repeat(50))

const taxiInRule = new TaxiInLights.default()

// Test 9: No violation when on ground but stationary
console.log('\n✓ Test 9: No violation - on ground, stationary')
const result9 = taxiInRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  parkBrake: true,
  gearUp: false,
  taxiLights: false,
}))
const pass9 = result9 === undefined
console.log(`  Result: ${pass9 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result9})`)
tests.push(pass9)

// Test 10: Violation when taxiing in and lights off
console.log('\n✓ Test 10: Violation - taxiing in, taxi lights OFF')
const result10 = taxiInRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 10 },
  parkBrake: false,
  gearUp: false,
  taxiLights: false,
}))
const pass10 = result10 === true
console.log(`  Result: ${pass10 ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result10})`)
tests.push(pass10)

// Test 11: No violation when taxiing in with lights ON
console.log('\n✓ Test 11: No violation - taxiing in with lights ON')
const result11 = taxiInRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 10 },
  parkBrake: false,
  gearUp: false,
  taxiLights: true,
}))
const pass11 = result11 === undefined
console.log(`  Result: ${pass11 ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result11})`)
tests.push(pass11)

// ============================================
// SUMMARY
// ============================================
console.log('\n\n' + '='.repeat(50))
console.log('📊 Test Summary')
console.log('='.repeat(50))

const totalTests = tests.length
const passedTests = tests.filter(t => t === true).length

console.log(`\nTotal Tests: ${totalTests}`)
console.log(`Passed: ${passedTests} ✅`)
console.log(`Failed: ${totalTests - passedTests} ❌`)
console.log(`\nSuccess Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

process.exit(passedTests === totalTests ? 0 : 1)
