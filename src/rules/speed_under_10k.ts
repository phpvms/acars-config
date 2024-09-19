/**
 * Determine if the beacon lights are on while the aircraft is in motio
 */
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class SpeedUnder10K implements Rule {
  meta: Meta = {
    id: 'SPEED_UNDER_10K',
    name: 'Speed under 10k exceeds ',
    enabled: true,
    message: 'Speed under 10k exceeds ',
    states: [],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround) {
      return [false]
    }

    return Acars.ViolatedAfterDelay(
      this.meta.name,
      this.meta.delay_time,
      (): RuleValue => {
        // Ignore landing lights being turned on
        const violated =
          data.indicatedAirspeed.Knots > this.meta.parameter! &&
          data.planeAltitude.Feet < 10000

        return [violated, this.meta.message + this.meta.parameter!]
      },
    )
  }
}
