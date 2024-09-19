/**
 * If the fuel level is higher at any point
 */
import { SimType } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class SimRate implements Rule {
  meta: Meta = {
    id: 'SIMRATE_INCREASED',
    name: 'Sim rate changed',
    enabled: true,
    message: 'Sim rate changed',
    states: [],
    repeatable: true,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 1,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return [data.simRate > this.meta.parameter!]
  }
}
