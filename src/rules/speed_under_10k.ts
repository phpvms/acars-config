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

    speed: 260,
    altitude: 10000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround) {
      return
    }

    // This should come from the web-module, if it's been updated
    if (this.meta.parameter > 0) {
      this.meta.speed = this.meta.parameter
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time,
      (): RuleValue => {
        // Ignore landing lights being turned on
        const violated =
          data.indicatedAirspeed.Knots > this.meta.speed &&
          data.planeAltitude.Feet < this.meta.altitude

        if (violated) {
          return [this.meta.message + this.meta.speed]
        }
      },
    )
  }
}
