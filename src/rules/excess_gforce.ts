/**
 * Detect if there's excess gforces
 */
import { AircraftFeature, PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class ExcessGForce implements Rule {
  meta: Meta = {
    id: 'EXCESS_GFORCE',
    name: 'GForce exceeded limit',
    enabled: true, // Default, will change depending on airline config
    message: 'GForce exceeded limit',
    states: [
      PirepState.Takeoff,
      PirepState.Enroute,
      PirepState.Approach,
      PirepState.Final,
    ],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 4,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround) {
      return [false]
    }

    return [data.gForce >= this.meta.parameter!]
  }
}
