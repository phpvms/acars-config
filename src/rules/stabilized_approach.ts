/**
 * If the fuel level is higher at any point
 */
import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class StabilizedApproach implements Rule {
  meta: Meta = {
    id: 'STABILIZED_APPROACH',
    name: 'Approach is not stabilized',
    enabled: true,
    message: 'Approach is not stabilized',
    states: [PirepState.Approach, PirepState.Final],
    repeatable: true,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 1,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround) {
      return [false]
    }

    // Above the min altitude so ignore it
    if (data.groundAltitude.Feet > this.meta.parameter!) return [false]

    if (data.gearUp) return [true]

    // No flaps landing doesn't seem right
    if (pirep.features == null) {
      return [false]
    }

    return [pirep.features.flapsCount > 0 && data.flaps === 0]
  }
}
