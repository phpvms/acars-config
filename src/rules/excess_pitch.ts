/**
 * Detect is the aircraft is pitched up or down excessively
 */
import { AircraftFeature, PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class ExcessPitch implements Rule {
  meta: Meta = {
    id: 'EXCESS_PITCH',
    name: 'Pitch exceeded limit',
    enabled: true,
    message: 'Pitch exceeded limit',
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

    return [
      data.pitch < -1 * this.meta.parameter! ||
        data.pitch > this.meta.parameter!,
    ]
  }
}
