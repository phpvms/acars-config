import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class StrobesOnTakeoff implements Rule {
  meta: Meta = {
    id: 'STROBES_ON_TAKEOFF',
    name: 'Strobes must be on during takeoff',
    enabled: true,
    message: 'Strobes must be on during takeoff',
    states: [PirepState.Takeoff],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Violation: strobes are off during takeoff
    return !data.strobeLights
  }
}
