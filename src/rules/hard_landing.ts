import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class HardLanding implements Rule {
  meta: Meta = {
    id: 'HARD_LANDING',
    name: 'Hard landing detection by descent rate',
    enabled: true,
    message: 'Hard landing detected',
    states: [PirepState.Landed],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    const landingRateFpm = pirep.landingRate.FeetPerMinute
    const absRate = Math.abs(landingRateFpm)

    // Check landing rate severity and return appropriate penalty
    if (absRate < 500) {
      // Soft landing, no violation
      return
    }

    if (absRate >= 1000) {
      // Extreme hard landing - flight lost
      return ['Flight lost - excessive landing rate', -100]
    }

    if (absRate >= 800) {
      // Very hard landing: -800 to -1000 fpm
      return ['Hard landing - excessive descent rate', -15]
    }

    if (absRate >= 650) {
      // Hard landing: -650 to -800 fpm
      return ['Hard landing detected', -10]
    }

    // Firm landing: -500 to -650 fpm
    return ['Firm landing', -5]
  }
}
