/**
 * Evaluate if this rule has been violated. If they go overspeed, then start the
 * stopwatch. Then mark it as violated if they've gone overspeed for ~ 6 seconds
 * 6 seconds to make sure it doesn't interfere with a takeoff roll
 */
import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class ExcessTaxiSpeed implements Rule {
  meta: Meta = {
    id: 'EXCESS_TAXI_SPEED',
    name: 'Taxi speed exceeded limit',
    enabled: true,
    message: 'Taxi speed exceeded limit',
    states: [PirepState.TaxiIn, PirepState.TaxiOut],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 4,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time,
      (): RuleValue => {
        if (!data.onGround) {
          return [false]
        }

        // If they're on a runway, ignore any taxi speed warnings, might be taking off
        if (data.approachingRunway != null || data.runway != null) {
          return [false]
        }

        return [data.groundSpeed.Knots > this.meta.parameter!]
      },
    )
  }
}
