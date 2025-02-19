import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class Zibo738 extends AircraftConfig {
  meta: Meta = {
    id: 'zibo_738',
    name: 'Zibo 738',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.LogoLights]: {
      'laminar/B738/toggle_switch/logo_light': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'laminar/B738/toggle_switch/taxi_light_brightness_pos': FeatureType.Int,
    },
  }

  /**
   * Determine if this config map should be used for the given aircraft
   *
   * @param {string} title The title of the aircraft, lowercased
   * @param {string=} icao The ICAO of the aircraft. Might not be available
   * @param {string=} config_path Path to the aircraft config. Might not be there
   * @return {boolean}
   */
  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps('', 'b738', '')
    return ['boeing', '737-800x'].every((w) => title.includes(w))
  }

  logoLights(value: number): FeatureState {
    return value == 1
  }

  taxiLights(value: number): FeatureState {
    return value == 2
  }
}
