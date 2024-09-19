/**
 * Excess bank angle
 */
import { AircraftFeature, PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class ExcessBank implements Rule {
  meta: Meta = {
    id: 'EXCESS_BANK',
    name: 'Bank angle exceeded limit',
    enabled: true, // Default, will change depending on airline config
    message: 'Bank angle exceeded limit',
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
    parameter: 30, // default, gets overwritten from remote
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround) {
      return [false]
    }

    return Acars.ViolatedAfterDelay(this.meta.id, this.meta.delay_time, () => {
      // +Bank is right, -Bank is left
      const value =
        data.bank < -1 * this.meta.parameter! ||
        data.bank > this.meta.parameter!

      if (value) {
        return [true]
      } else {
        return [false]
      }
    })
  }
}
