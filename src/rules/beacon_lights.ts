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

    // No violation if on the ground and not moving, and engines are off
    if (!isMoving && !enginesRunning) {
      return
    }

    // Violation: engines running or moving, but beacon lights are off
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        return (isMoving || enginesRunning) && !data.beaconLights
      },
    )
  }
}
