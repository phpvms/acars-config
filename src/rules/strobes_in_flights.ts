/**
 * Determine if strobe lights are on while in flight
 */
import { AircraftFeature, PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class StrobesInFlight implements Rule {
  meta: Meta = {
    id: 'STROBES_ON_IN_FLIGHT',
    name: 'Strobe lights on',
    enabled: true, // Default, will change depending on airline config
    message: 'Strobes must be on while in flight',
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
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (!Acars.IsFeatureEnabled(AircraftFeature.StrobeLights)) {
      return [false]
    }

    return Acars.ViolatedAfterDelay(this.meta.id, this.meta.delay_time, () => {
      return !data.strobeLights ? [true] : [false]
    })
  }
}
