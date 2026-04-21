import { createMocks, createMockPirep } from './mocks.js'

// Setup mocks
createMocks()

// Import the rules
import BeaconLights from '../src/rules/beacon_lights.ts'
import TaxiLights from '../src/rules/taxi_lights.ts'
import TaxiInLights from '../src/rules/taxi_in_lights.ts'

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
console.log('=' .repeat(50))

const beaconRule = new BeaconLights()
const mockPirep = createMockPirep()

// Test 1: No violation when on ground, not moving, engines off
console.log('\n✓ Test 1: No violation - on ground, stationary, engines off')
const result1 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  anyEnginesRunning: false,
  beaconLights: false,
}))
console.log(`  Result: ${result1 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result1})`)

// Test 2: Violation when engines running but beacon off
console.log('\n✓ Test 2: Violation - engines running, beacon OFF')
const result2 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  anyEnginesRunning: true,
  beaconLights: false,
}))
console.log(`  Result: ${result2 === true ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result2})`)

// Test 3: Violation when moving but beacon off
console.log('\n✓ Test 3: Violation - aircraft moving, beacon OFF')
const result3 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 5 },
  anyEnginesRunning: false,
  beaconLights: false,
}))
console.log(`  Result: ${result3 === true ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result3})`)

// Test 4: No violation when in air
console.log('\n✓ Test 4: No violation - in air (onGround: false)')
const result4 = beaconRule.violated(mockPirep, createMockTelemetry({
  onGround: false,
  groundSpeed: { Knots: 300 },
  anyEnginesRunning: true,
  beaconLights: false,
}))
console.log(`  Result: ${result4 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result4})`)

// ============================================
// TAXI LIGHTS (TAXIOUT) TESTS
// ============================================
console.log('\n\n📍 Testing: Taxi Lights (TaxiOut) Rule')
console.log('=' .repeat(50))

const taxiRule = new TaxiLights()

// Test 5: No violation when on ground but stationary
console.log('\n✓ Test 5: No violation - on ground, stationary')
const result5 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  parkBrake: true,
  gearUp: false,
  taxiLights: false,
}))
console.log(`  Result: ${result5 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result5})`)

// Test 6: Violation when taxiing and lights off
console.log('\n✓ Test 6: Violation - taxiing, taxi lights OFF')
const result6 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 5 },
  parkBrake: false,
  gearUp: false,
  taxiLights: false,
}))
console.log(`  Result: ${result6 === true ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result6})`)

// Test 7: No violation when taxiing with lights ON
console.log('\n✓ Test 7: No violation - taxiing with taxi lights ON')
const result7 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 5 },
  parkBrake: false,
  gearUp: false,
  taxiLights: true,
}))
console.log(`  Result: ${result7 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result7})`)

// Test 8: No violation when in air
console.log('\n✓ Test 8: No violation - in air (onGround: false)')
const result8 = taxiRule.violated(mockPirep, createMockTelemetry({
  onGround: false,
  groundSpeed: { Knots: 200 },
  parkBrake: false,
  gearUp: true,
  taxiLights: false,
}))
console.log(`  Result: ${result8 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result8})`)

// ============================================
// TAXI IN LIGHTS TESTS
// ============================================
console.log('\n\n📍 Testing: Taxi In Lights Rule')
console.log('=' .repeat(50))

const taxiInRule = new TaxiInLights()

// Test 9: No violation when on ground but stationary
console.log('\n✓ Test 9: No violation - on ground, stationary')
const result9 = taxiInRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 0 },
  parkBrake: true,
  gearUp: false,
  taxiLights: false,
}))
console.log(`  Result: ${result9 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result9})`)

// Test 10: Violation when taxiing in and lights off
console.log('\n✓ Test 10: Violation - taxiing in, taxi lights OFF')
const result10 = taxiInRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 10 },
  parkBrake: false,
  gearUp: false,
  taxiLights: false,
}))
console.log(`  Result: ${result10 === true ? 'PASS ✅' : 'FAIL ❌'} (expected: true, got: ${result10})`)

// Test 11: No violation when taxiing in with lights ON
console.log('\n✓ Test 11: No violation - taxiing in with lights ON')
const result11 = taxiInRule.violated(mockPirep, createMockTelemetry({
  onGround: true,
  groundSpeed: { Knots: 10 },
  parkBrake: false,
  gearUp: false,
  taxiLights: true,
}))
console.log(`  Result: ${result11 === undefined ? 'PASS ✅' : 'FAIL ❌'} (expected: undefined, got: ${result11})`)

// ============================================
// SUMMARY
// ============================================
console.log('\n\n' + '=' .repeat(50))
console.log('📊 Test Summary')
console.log('=' .repeat(50))
const totalTests = 11
const passedTests = [result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11]
  .reduce((count, result, idx) => {
    const expected = [
      undefined, true, true, undefined,
      undefined, true, undefined, undefined,
      undefined, true, undefined,
    ]
    return (result === expected[idx] || (result === true && expected[idx] === true)) ? count + 1 : count
  }, 0)

console.log(`\nTotal Tests: ${totalTests}`)
console.log(`Passed: ${passedTests} ✅`)
console.log(`Failed: ${totalTests - passedTests} ❌`)
console.log(`\nSuccess Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
