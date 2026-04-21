import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class UnstabilizedApproach implements Rule {
  meta: Meta = {
    id: 'UNSTABILIZED_APPROACH',
    name: 'Unstabilized approach detection',
    enabled: true,
    message: 'Unstabilized approach detected',
    states: [PirepState.Approach, PirepState.Final],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -10,
    delay_time: 5000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    const altitudeAGL = data.groundAltitude.Feet
    const indicatedAirspeed = data.indicatedAirspeed.Knots
    const verticalSpeedFpm = data.verticalSpeed.FeetPerMinute
    const flapsPosition = data.flaps
    const gearUp = data.gearUp

    // Only check stabilization criteria below 1,000 feet AGL during descent
    if (altitudeAGL > 1000) {
      return
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        // Check gear extension
        if (gearUp) {
          return [
            `Unstabilized approach - gear not extended at ${altitudeAGL.toFixed(0)} ft AGL`,
            -10,
          ]
        }

        // Check excessive descent rate
        if (verticalSpeedFpm < -2000) {
          return [
            `Unstabilized approach - excessive descent rate: ${verticalSpeedFpm.toFixed(0)} fpm (limit: -2000 fpm)`,
            -10,
          ]
        }

        // Check overspeed
        if (indicatedAirspeed > 200) {
          return [
            `Unstabilized approach - overspeed: ${indicatedAirspeed.toFixed(0)} knots (limit: 200 knots)`,
            -10,
          ]
        }

        // Check flap configuration
        if (flapsPosition === 0) {
          return [
            `Unstabilized approach - flaps not configured in approach`,
            -10,
          ]
        }

        return
      },
    )
  }
}
