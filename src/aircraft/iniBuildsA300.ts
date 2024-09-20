import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class IniBuildsA3N extends AircraftConfig {
  meta: Meta = {
    id: 'inibuilds_a300',
    name: 'IniBuilds A300',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'A300/switches/animations_current': FeatureType.NumberArray,
    },
    [AircraftFeature.LandingLights]: {
      'A300/switches/animations_current': FeatureType.NumberArray,
    },
    [AircraftFeature.LogoLights]: false,
    [AircraftFeature.NavigationLights]: {
      'A300/switches/animations_current': FeatureType.NumberArray,
    },
    [AircraftFeature.StrobeLights]: {
      'A300/switches/animations_current': FeatureType.NumberArray,
    },
    [AircraftFeature.TaxiLights]: {
      'A300/switches/animations_current': FeatureType.NumberArray,
    },
    [AircraftFeature.WingLights]: {
      'A300/switches/animations_current': FeatureType.NumberArray,
    },
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: '15/0',
    2: '15/15',
    3: '15/20',
    4: '30/40',
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
    return (
      ['airbus', 'a300'].every((w) => title.includes(w)) ||
      ['airbus', 'a310'].every((w) => title.includes(w))
    )
  }

  beaconLights(value: number[]): FeatureState {
    return value[4] === 1
  }

  landingLights(value: number[]): FeatureState {
    return value[7] === 1 && value[8] === 1
  }

  navigationLights(value: number[]): FeatureState {
    return value[1] === 1 || value[1] === 2
  }

  strobeLights(value: number[]): FeatureState {
    return value[3] === 1
  }

  taxiLights(value: number[]): FeatureState {
    return value[0] === 1 || value[0] === 2
  }

  wingLights(value: number[]): FeatureState {
    return value[2] === 1
  }
}
