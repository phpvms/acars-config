/**
 * Determine if the beacon lights are on while the aircraft is in motio
 */
import { AircraftFeature, PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class LightsOffDuringTaxi implements Rule {
  meta: Meta = {
    id: 'STROBES_ON_TAXI',
    name: 'Strobes must be off during pushback or taxi',
    enabled: true,
    message: 'Strobes must be off during pushback or taxi',
    states: [
      PirepState.TaxiOut,
      PirepState.Pushback,
      PirepState.TaxiIn,
      PirepState.OnBlock,
      PirepState.Arrived,
    ],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (!Acars.IsFeatureEnabled(AircraftFeature.StrobeLights)) {
      return [false]
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time,
      (): RuleValue => {
        // Ignore landing lights being turned on
        if (data.approachingRunway != null || data.runway != null) {
          return [false]
        }

        return [data.strobeLights]
      },
    )
  }
}
