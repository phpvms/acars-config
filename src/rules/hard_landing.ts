import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class HandLandings implements Rule {
  meta: Meta = {
    id: 'HARD_LANDING',
    name: 'Hard Landing',
    enabled: true, // Default, will change depending on airline config
    message: 'Hard Landing',
    states: [PirepState.Final, PirepState.Landed],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    parameter: 300, // default, gets overwritten from remote
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    const absRate = Math.abs(pirep.landingRate.FeetPerMinute)
    const absParam = Math.abs(this.meta.parameter!)
    if (absRate < absParam) {
      return [false]
    }

    console.log(
      `Hard landing violation, rate=${absRate}, threshold=${absParam}`,
    )

    return [true]
  }
}
