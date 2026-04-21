import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class TaxiInLights implements Rule {
  meta: Meta = {
    id: 'TAXI_IN_LIGHTS',
    name: 'Taxi lights must be on during taxi in',
    enabled: true,
    message: 'Taxi lights must be on during taxi in',
    states: [PirepState.TaxiIn],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 180000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Only check during taxi in on the ground
    if (!data.onGround) {
      return
    }

    // Only flag if actually moving and not parked
    const isMoving = data.groundSpeed.Knots >= 10
    const isParked = data.parkBrake && data.groundSpeed.Knots < 10
    const gearDown = !data.gearUp

    if (!isMoving || isParked || !gearDown) {
      return
    }

    return Acars.ViolatedAfterDelay(
      this.meta.id,
      this.meta.delay_time!,
      (): RuleValue => {
        return !data.taxiLights
      },
    )
  }
}
