import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class StrobesOnFlight implements Rule {
  meta: Meta = {
    id: 'STROBES_ON_FLIGHT',
    name: 'Strobes must be on during flight',
    enabled: true,
    message: 'Strobes must be on during flight',
    states: [
      PirepState.Takeoff,
      PirepState.InitialClimb,
      PirepState.Enroute,
      PirepState.Approach,
      PirepState.Final,
      PirepState.Landed,
    ],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 30000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        // Violation: strobes are off during flight
        return !data.strobeLights
      },
    )
  }
}
