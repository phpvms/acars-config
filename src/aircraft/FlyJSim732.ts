import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class FlyJSim732 extends AircraftConfig {
  meta: Meta = {
    id: 'flyjsim_732',
    name: 'FlyJSim 732',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'FJS/732/lights/AntiColLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'FJS/732/lights/InBoundLLightSwitch1': FeatureType.Int,
      'FJS/732/lights/InBoundLLightSwitch2': FeatureType.Int,
      'FJS/732/lights/OutBoundLLightSwitch1': FeatureType.Int,
      'FJS/732/lights/OutBoundLLightSwitch2': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'FJS/732/lights/LogoLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'FJS/732/lights/PositionLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'FJS/732/lights/StrobeLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'FJS/732/lights/TaxiLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'FJS/732/lights/WingLightSwitch': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'B732', '')
    return ['fjs', '722'].every((w) => title.includes(w))
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
    return inbd_l == 1 && inbd_r == 1 && outb_l == 2 && outb_r == 2
  }

  logoLights(value: number): FeatureState {
    return value == 1
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
