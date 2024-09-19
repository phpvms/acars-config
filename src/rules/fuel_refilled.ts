/**
 * If the fuel level is higher at any point
 */
import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class FuelRefilled implements Rule {
  meta: Meta = {
    id: 'EXCESS_TAXI_SPEED',
    name: 'Taxi speed exceeded limit',
    enabled: true,
    message: 'Taxi speed exceeded limit',
    states: [],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 4,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround || previousData == null) {
      return [false]
    }

    if (data.fuelQuantity.Pounds > previousData.fuelQuantity.Pounds) {
      return [false]
    }

    return [
      Acars.NumberOverPercent(
        data.fuelQuantity.Pounds,
        previousData.fuelQuantity.Pounds,
        10,
      ),
      `Fuel Refilled: Current: ${data.fuelQuantity.Pounds}, previous=${previousData.fuelQuantity.Pounds}`,
    ]
  }
}
