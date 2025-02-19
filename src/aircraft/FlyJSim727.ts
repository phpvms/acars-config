import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class FlyJSim727 extends AircraftConfig {
  meta: Meta = {
    id: 'flyjsim_727',
    name: 'FlyJSim 727',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'FJS/727/lights/BeaconLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'FJS/727/lights/InboundLLSwitch_L': FeatureType.Int,
      'FJS/727/lights/InboundLLSwitch_R': FeatureType.Int,
      'FJS/727/lights/OutboundLLSwitch_L': FeatureType.Int,
      'FJS/727/lights/OutboundLLSwitch_R': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'FJS/727/lights/LogoLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'FJS/727/lights/NavLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'FJS/727/lights/StrobeLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'FJS/727/lights/TaxiLightSwitch': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'FJS/727/lights/WingLightSwitch': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'B727', '')
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
    return inbd_l == 1 && inbd_r == 1 && outb_l == 1 && outb_r === 1
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
    return value === 1
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }
}
