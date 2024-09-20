import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class RotateMD11 extends AircraftConfig {
  meta: Meta = {
    id: 'rotate_md11',
    name: 'Rotate MD-11',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'Rotate/aircraft/controls/beacon_lts': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'Rotate/aircraft/controls/ldg_l_lts': FeatureType.Int,
      'Rotate/aircraft/controls/ldg_r_lts': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'Rotate/aircraft/controls/logo_lts': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'Rotate/aircraft/controls/nav_lts': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'Rotate/aircraft/controls/strobe_lts': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'Rotate/aircraft/controls/nose_lts': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'Rotate/aircraft/controls/wing_l_lts': FeatureType.Int,
      'Rotate/aircraft/controls/wing_r_lts': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'md11', '')
    return ['rotate', 'md-11'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(v1: number, v2: number) {
    return v1 === 2 && v2 === 2
  }

  logoLights(value: number): FeatureState {
    return value === 1
  }

  navigationLights(value: number): FeatureState {
    return value === 1
  }

  strobeLights(value: number): FeatureState {
    return value === 1
  }

  taxiLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  wingLights(v1: number, v2: number) {
    return v1 === 2 && v2 === 2
  }
}
