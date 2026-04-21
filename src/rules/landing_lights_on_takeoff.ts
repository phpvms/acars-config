import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class LandingLightsOnTakeoff implements Rule {
  meta: Meta = {
    id: 'LANDING_LIGHTS_ON_TAKEOFF',
    name: 'Landing lights must be on during takeoff',
    enabled: true,
    message: 'Landing lights must be on during takeoff',
    states: [PirepState.Takeoff],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Violation: landing lights are off during takeoff
    return !data.landingLights
  }
}
