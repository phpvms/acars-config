/**
 * Determine if the beacon lights are on while the aircraft is in motio
 */
import { AircraftFeature, PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class LightsUnder10K implements Rule {
  meta: Meta = {
    id: 'LAND_LIGHTS_UNDER_10K',
    name: 'Landing lights must be on below ',
    enabled: true,
    message: 'Landing lights must be on below ',
    states: [],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (!Acars.IsFeatureEnabled(AircraftFeature.LandingLights)) {
      return
    }

    if (data.onGround) {
      return
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time,
      (): RuleValue => {
        // Ignore landing lights being turned on
        const violated =
          !data.landingLights &&
          data.planeAltitude.Feet < this.meta.parameter! - 500

        if (violated) {
          return [this.meta.message + this.meta.parameter!]
        }
      },
    )
  }
}
