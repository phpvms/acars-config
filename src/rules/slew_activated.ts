/**
 * If the fuel level is higher at any point
 */
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class SlewActivated implements Rule {
  meta: Meta = {
    id: 'SLEW_ACTIVATED',
    name: 'Slew activated',
    enabled: true,
    message: 'Slew activated',
    states: [],
    repeatable: true,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 1,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return data.slewActive
  }
}
