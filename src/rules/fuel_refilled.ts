/**
 * If the fuel level is higher at any point
 */
import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class FuelRefilled implements Rule {
  meta: Meta = {
    id: 'FUEL_REFILLED',
    name: 'Fuel refilled',
    enabled: true,
    message: 'Fuel refilled',
    states: [
      PirepState.Pushback,
      PirepState.TaxiOut,
      PirepState.Takeoff,
      PirepState.Enroute,
      PirepState.Approach,
      PirepState.Final,
      PirepState.Landed,
      PirepState.TaxiIn,
      PirepState.OnBlock,
    ],
    repeatable: false,
    cooldown: 60,
    max_count: 3,
    points: -1,
    delay_time: 5000,
    parameter: 4,
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    if (data.onGround || previousData == null) {
      return
    }

    if (data.fuelQuantity.Pounds < previousData.fuelQuantity.Pounds) {
      return
    }

    const violated = Acars.NumberOverPercent(
      data.fuelQuantity.Pounds,
      previousData.fuelQuantity.Pounds,
      10,
    )

    if (violated) {
      return [
        `Fuel Refilled: Current: ${data.fuelQuantity.Pounds}, previous=${previousData.fuelQuantity.Pounds}`,
      ]
    }
  }
}
