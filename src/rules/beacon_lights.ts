/**
 * Determine if the beacon lights are on while the aircraft is in motio
 */
import { AircraftFeature } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class BeaconLights implements Rule {
  meta: Meta = {
    id: 'BEACON_LIGHTS_ON_ENGINE_RUNNING',
    name: 'Beacon Lights On',
    enabled: true, // Default, will change depending on airline config
    message: 'Beacon lights must be on while engine is running',
    states: [],
    repeatable: false, // set from remote later
    cooldown: 60, // set from remote later
    max_count: 3, // set from remote later
    points: -1, // set from remote later
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (!Acars.IsFeatureEnabled(AircraftFeature.BeaconLights)) {
      return [false]
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time,
      (): RuleValue => {
        if (!pirep.isInActiveState) {
          return [false]
        }

        return data.anyEnginesRunning && !data.beaconLights ? [true] : [false]
      },
    )
  }
}
