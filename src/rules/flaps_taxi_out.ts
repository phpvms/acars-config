import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class FlapsTaxiOut implements Rule {
  meta: Meta = {
    id: 'FLAPS_TAXI_OUT',
    name: 'Flaps must be configured during taxi out',
    enabled: true,
    message: 'Flaps must be configured during taxi out',
    states: [PirepState.TaxiOut],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -5,
    delay_time: 30000,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Only check during taxi out on the ground
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
        // Violation: flaps not configured (flaps position = 0)
        return data.flaps === 0
      },
    )
  }
}
