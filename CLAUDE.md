# Coljet Rules - vmsACARS Plugin Development Kit

## Project Overview

**Coljet Rules** is a TypeScript-based flight validation system for the vmsACARS virtual airline operations platform. It monitors pilot behavior, enforces operational standards, and tracks flight performance through a comprehensive set of rules and validations.

### Purpose
- Validate flight operations according to FAA and ICAO standards
- Detect and penalize rule violations during flight
- Track hard landings, long landings, and operational compliance
- Support virtual airline training and rating systems

---

## Architecture

### Directory Structure
```
/src/
├── aircraft/          # 29 aircraft configurations
├── rules/             # Flight validation rules
├── scripts/           # Callback hooks for real-time monitoring
├── types/             # TypeScript type definitions
├── interface/         # Abstract base classes
├── mappings/          # Reference data (airports)
├── defs.ts           # Enumerations and constants
└── package.json

/tests/
├── comprehensive-rules.test.js
├── simple-rules.test.js
└── mocks.js
```

### Core Patterns

**Rules**: Implement `Rule` interface with:
- `meta`: Configuration (id, name, enabled, states, points, delay_time)
- `violated()`: Returns `RuleValue` (undefined/boolean/[message, points])

**Telemetry**: Real-time aircraft data with:
- Light status (beacon, landing, strobes, taxi, etc.)
- Aircraft state (onGround, groundSpeed, altitude, pitch, bank)
- Engine status (anyEnginesRunning, n1Percent, throttle)
- Landing metrics (landingRate, gForceTouchDown)

---

## Rules Implemented (11 Total)

### 1. Beacon Lights
- **File**: `src/rules/beacon_lights.ts`
- **Trigger**: Any engines running OR aircraft moving (>2 knots)
- **States**: Boarding, Pushback, TaxiOut, Takeoff, Enroute, Approach, Final, Landed, TaxiIn
- **Penalty**: -5 points
- **Delay**: 5 seconds
- **Repeatable**: No

### 2. Taxi Out Lights
- **File**: `src/rules/taxi_out_lights.ts`
- **Trigger**: Moving at ≥10 knots on ground during TaxiOut
- **States**: TaxiOut
- **Penalty**: -5 points
- **Delay**: 30 seconds
- **Repeatable**: No

### 3. Taxi In Lights
- **File**: `src/rules/taxi_in_lights.ts`
- **Trigger**: Moving at ≥10 knots on ground during TaxiIn
- **States**: TaxiIn
- **Penalty**: -5 points
- **Delay**: 60 seconds (1 minute)
- **Repeatable**: No

### 4. Flaps Taxi Out
- **File**: `src/rules/flaps_taxi_out.ts`
- **Trigger**: Moving at ≥10 knots with flaps at position 0
- **States**: TaxiOut
- **Penalty**: -5 points
- **Delay**: 30 seconds
- **Repeatable**: No

### 5. Flaps Takeoff
- **File**: `src/rules/flaps_takeoff.ts`
- **Trigger**: During Takeoff phase with flaps at 0
- **States**: Takeoff
- **Penalty**: -10 points
- **Delay**: None (immediate)
- **Repeatable**: No

### 6. Landing Lights Off 10k
- **File**: `src/rules/landing_lights_off_10k.ts`
- **Trigger**: Altitude > 10,000 feet AGL with landing lights ON
- **States**: Takeoff, Enroute, Approach
- **Penalty**: -5 points
- **Delay**: 30 seconds
- **Repeatable**: No

### 7. Landing Lights On Takeoff
- **File**: `src/rules/landing_lights_on_takeoff.ts`
- **Trigger**: During Takeoff with landing lights OFF
- **States**: Takeoff
- **Penalty**: -5 points
- **Delay**: None (immediate)
- **Repeatable**: No

### 8. Strobes On Takeoff
- **File**: `src/rules/strobes_on_takeoff.ts`
- **Trigger**: During Takeoff with strobes OFF
- **States**: Takeoff
- **Penalty**: -5 points
- **Delay**: None (immediate)
- **Repeatable**: No

### 9. Strobes On Flight
- **File**: `src/rules/strobes_on_flight.ts`
- **Trigger**: During Enroute/Approach/Final with strobes OFF
- **States**: Enroute, Approach, Final
- **Penalty**: -5 points
- **Delay**: 30 seconds
- **Repeatable**: No

### 10. Hard Landing
- **File**: `src/rules/hard_landing.ts`
- **Trigger**: Landing descent rate severity
- **States**: Landed
- **Penalties**:
  - 500-650 fpm: -5 points ("Firm landing")
  - 650-800 fpm: -10 points ("Hard landing")
  - 800-1000 fpm: -15 points ("Very hard landing")
  - >1000 fpm: -100 points ("Extreme hard landing, possible crash or structural damage")
- **Delay**: None
- **Repeatable**: No

### 11. Long Landing
- **File**: `src/rules/long_landing.ts`
- **Trigger**: Landing beyond calculated Touchdown Zone
- **States**: Landed
- **TDZ Calculation** (ICAO Annex 14):
  - Runways ≥ 2,400 m: TDZ = 900 m
  - Runways 1,500-2,400 m: TDZ = 600 m
  - Runways < 1,500 m: TDZ variable
- **Penalties**:
  - Beyond TDZ but < 50% runway: -10 points
  - Beyond 50% runway: -100 points
- **Delay**: None
- **Repeatable**: No

---

## Standards References

### FAA Standards
- Touchdown Zone: First 3,000 feet (914 meters) from threshold
- Touchdown zone markings in 500-foot increments
- See: [FAA Airport Markings](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap2_section_3.html)

### ICAO/OACI Standards (Annex 14)
- **Runways ≥ 2,400 m**: TDZ = 900 m, aiming point @ 400 m
- **Runways 1,500-2,400 m**: TDZ = 600 m, aiming point @ 300 m
- **Runways < 900 m**: TDZ markings simplified

---

## Adding New Rules

### Template
```typescript
import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class RuleName implements Rule {
  meta: Meta = {
    id: 'RULE_ID',
    name: 'Human-readable name',
    enabled: true,
    message: 'Violation message',
    states: [PirepState.Takeoff, /* other states */],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 30000, // optional, in milliseconds
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Return undefined/null for no violation
    // Return true/false for simple violation
    // Return [message, points] for custom message and penalty
    
    if (/* condition */) {
      return
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        return /* violation condition */
      },
    )
  }
}
```

### Guidelines
1. Use ICAO/FAA standards as reference
2. Include delay_time for safety (avoid false positives)
3. Keep penalties realistic (typically -5 to -100 points)
4. Add clear violation messages with actual values
5. Test with mock data in `tests/comprehensive-rules.test.js`

---

## Testing

### Run Comprehensive Tests
```bash
node tests/comprehensive-rules.test.js
```

### Test Coverage
- 19 test cases covering all 11 rules
- 100% success rate validation
- Mock telemetry with various scenarios

### Test Files
- `tests/comprehensive-rules.test.js` - Full test suite (19 tests, 100%)
- `tests/simple-rules.test.js` - Basic rule validation
- `tests/mocks.js` - Mock data and Acars helpers

---

## Build & Deployment

### Development
```bash
npm run dev          # Watch mode with auto-copy
npm run build        # Compile TypeScript
npm run lint         # ESLint with fixes
npm run format       # Prettier formatting
```

### Production
```bash
npm run dist         # Create distribution ZIP
```

### CI/CD
- GitHub Actions: `.github/workflows/distribute.yml`
- Auto-builds on PR/push to main
- Publishes to DigitalOcean Spaces CDN

---

## Key Data Types

### Telemetry Interface
```typescript
beaconLights: boolean
taxiLights: boolean
landingLights: boolean
strobeLights: boolean
onGround: boolean
groundSpeed: Speed          // .Knots property
groundAltitude: Length      // .Feet property
anyEnginesRunning: boolean
flaps: number               // Position (0 = retracted)
```

### Pirep Interface
```typescript
landingRate: Speed          // .FeetPerMinute property
arrivalRunway?: Runway      // .length.Meters, .distance.Meters
state: PirepState          // Current flight phase
```

### RuleValue Return Type
```typescript
undefined | null            // No violation
true | false               // Simple violation
[message, points]          // Custom message + penalty
[message]                  // Custom message only
```

---

## Future Improvements

- [ ] Add runway condition effects (wet, snow, ice)
- [ ] Implement crosswind penalties
- [ ] Add fuel management violations
- [ ] Create performance efficiency rules
- [ ] Add altitude constraint violations
- [ ] Implement steep descent warnings
- [ ] Add go-around detection
- [ ] Create descent rate violations

---

## Git Workflow

### Branch: `claude/review-coljet-rules-d5AzV`
All development happens on this feature branch. Commits should:
- Be descriptive with clear messages
- Include rule details and penalties
- Reference FAA/ICAO standards when applicable
- Include the session URL for tracking

### Commit Pattern
```
[Rule Name] - [Action Description]

[Details about the change, including parameters and logic]

https://claude.ai/code/session_01CYkcsgqvCKSuHSuv3aTu59
```

---

## Contact & Questions

For issues or questions about:
- **Rule logic**: Check the rule file and its `violated()` method
- **Telemetry data**: See `src/types/types.d.ts`
- **Testing**: Review `tests/comprehensive-rules.test.js`
- **Standards**: Reference FAA/ICAO sources above

---

**Last Updated**: April 2026
**Rules Count**: 11
**Test Coverage**: 100% (19/19 tests passing)
**Status**: Active Development
