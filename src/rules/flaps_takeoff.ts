import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class FlapsTakeoff implements Rule {
  meta: Meta = {
    id: 'FLAPS_TAKEOFF',
    name: 'Flaps must be configured for takeoff',
    enabled: true,
    message: 'Flaps must be configured for takeoff',
    states: [PirepState.Takeoff],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -10,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Violation: flaps not configured (flaps position = 0) during takeoff
    return data.flaps === 0
  }
}
