import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class TaxiLights implements Rule {
  meta: Meta = {
    id: 'TAXI_LIGHTS',
    name: 'Taxi lights must be on during taxi out',
    enabled: true,
    message: 'Taxi lights must be on during taxi out',
    states: [PirepState.TaxiOut],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 30000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        return !data.taxiLights
      },
    )
  }
}
