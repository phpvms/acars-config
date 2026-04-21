import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class LandingLightsOff10k implements Rule {
  meta: Meta = {
    id: 'LANDING_LIGHTS_OFF_10K',
    name: 'Landing lights must be off above 10,000 feet AGL',
    enabled: true,
    message: 'Landing lights must be off above 10,000 feet AGL',
    states: [
      PirepState.Takeoff,
      PirepState.Enroute,
      PirepState.Approach,
    ],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 30000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    const altitudeAGL = data.groundAltitude.Feet
    const isAbove10k = altitudeAGL > 10000

    // No violation if below 10,000 feet AGL
    if (!isAbove10k) {
      return
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        // Violation: above 10k feet AGL but landing lights still on
        return data.landingLights
      },
    )
  }
}
