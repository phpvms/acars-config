import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class IXEG733 extends AircraftConfig {
  meta: Meta = {
    id: 'ixeg_733',
    name: 'IXEG 733',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'ixeg/733/lighting/anti_col_lt_act': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'ixeg/733/lighting/l_inboard_ll_act': FeatureType.Int,
      'ixeg/733/lighting/r_inboard_ll_act': FeatureType.Int,
      'ixeg/733/lighting/l_outboard_ll_act': FeatureType.Int,
      'ixeg/733/lighting/r_outboard_ll_act': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'ixeg/733/lighting/logo_lt_act': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'ixeg/733/lighting/position_lt_act': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'ixeg/733/lighting/strobe_lt_act': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'ixeg/733/lighting/taxi_lt_act': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'ixeg/733/lighting/wing_lt_act': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'b733', '')
    return ['boeing', '737-300', 'x-aviation'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value == 1
  }

  landingLights(
    inbd_l: number,
    inbd_r: number,
    outb_l: number,
    outb_r: number,
  ): FeatureState {
    return inbd_l === 1 && inbd_r === 1 && outb_l === 2 && outb_r === 3
  }

  navigationLights(value: number): FeatureState {
    return value === 1
  }

  strobeLights(value: number): FeatureState {
    return value === 1
  }

  taxiLights(value: number): FeatureState {
    return value === 1
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }
}
