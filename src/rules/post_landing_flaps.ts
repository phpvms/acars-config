import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class PostLandingFlaps implements Rule {
  meta: Meta = {
    id: 'POST_LANDING_FLAPS',
    name: 'Flaps must be retracted after landing',
    enabled: true,
    message: 'Flaps must be retracted after landing',
    states: [PirepState.TaxiIn],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 180000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        // Violation: flaps not retracted (flaps position != 0)
        return data.flaps !== 0
      },
    )
  }
}
