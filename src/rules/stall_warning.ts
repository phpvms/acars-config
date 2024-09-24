/**
 * If the fuel level is higher at any point
 */
import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class SimRate implements Rule {
  meta: Meta = {
    id: 'STALL_WARNING',
    name: 'Stall warning',
    enabled: true,
    message: 'Stall warning',
    states: [
      PirepState.Takeoff,
      PirepState.Enroute,
      PirepState.Approach,
      PirepState.Final,
    ],
    repeatable: true,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 1,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return !data.onGround && data.stallWarning
  }
}
