import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class BeaconLights implements Rule {
  meta: Meta = {
    id: 'BEACON_LIGHTS',
    name: 'Beacon lights must be on when moving or engines running',
    enabled: true,
    message: 'Beacon lights must be on when moving or engines running',
    states: [
      PirepState.Pushback,
      PirepState.TaxiOut,
      PirepState.Takeoff,
      PirepState.Enroute,
      PirepState.Approach,
      PirepState.Final,
      PirepState.TaxiIn,
    ],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    const isMoving = data.groundSpeed.Knots > 2
    const enginesRunning = data.anyEnginesRunning
    const isOnGround = data.onGround

    // Only check while on ground. Beacons should be on when:
    // - Any engine is running
    // - Aircraft is moving (>2 knots)
    if (!isOnGround || (!enginesRunning && !isMoving)) {
      return
    }

    // Violation: on ground with engines running or moving, but beacon lights are off
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        return !data.beaconLights
      },
    )
  }
}
