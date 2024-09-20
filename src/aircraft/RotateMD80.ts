import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class RotateMD80 extends AircraftConfig {
  meta: Meta = {
    id: 'rotate_md80',
    name: 'Rotate MD-80',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'Rotate/md80/lights/anticollision_light_switch': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'Rotate/md80/lights/wing_ldg_light_switch_r': FeatureType.Int,
      'Rotate/md80/lights/wing_ldg_light_switch_l': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'Rotate/md80/lights/logo_light_switch': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'Rotate/md80/lights/pos_strobe_light_switch': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'Rotate/md80/lights/pos_strobe_light_switch': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'Rotate/md80/lights/nose_light_switch': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'Rotate/md80/lights/wing_light_switch': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'md80', '')
    return ['rotate', 'md-80'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(v1: number, v2: number): FeatureState {
    return v1 === 2 && v2 === 2
  }

  logoLights(value: number): FeatureState {
    return value === 1
  }

  navigationLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  strobeLights(value: number): FeatureState {
    return value === 2
  }

  taxiLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }
}
