import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class PMDG_777_FSUIPC extends AircraftConfig {
  meta: Meta = {
    id: 'pmdg_777_fsuipc',
    name: 'PMDG 777',
    sim: AircraftConfigSimType.Fsuipc,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      '0x6488': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      '0x6485': FeatureType.Int,
    },
    [AircraftFeature.LogoLight]: false,
    [AircraftFeature.NavigationLights]: {
      '0x650B': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      '0x648F': FeatureType.Int,
    },
    [AircraftFeature.TaxiLight]: {
      '0x648E': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: false,
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
    this.flapNames = GetDefaultFlaps('', 'b777', '')
    return ['pmdg', '777'].every((w) => title.includes(w.toLowerCase()))
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(value: number): FeatureState {
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
}
