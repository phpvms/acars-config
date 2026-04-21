import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class LandingLightsOnTakeoff implements Rule {
  meta: Meta = {
    id: 'LANDING_LIGHTS_ON_TAKEOFF',
    name: 'Landing lights must be on during takeoff and landing',
    enabled: true,
    message: 'Landing lights must be on during takeoff and landing',
    states: [PirepState.Takeoff, PirepState.Landed],
    repeatable: true,
    cooldown: 300,
    max_count: 2,
    points: -5,
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        // Violation: landing lights are off during takeoff
        return !data.landingLights
      },
    )
  }
}
