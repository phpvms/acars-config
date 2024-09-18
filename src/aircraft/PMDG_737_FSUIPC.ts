import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class PMDG_737_FSUIPC extends AircraftConfig {
  meta: Meta = {
    id: 'pmdg_737_fsuipc',
    name: 'PMDG 737',
    sim: AircraftConfigSimType.Fsuipc,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      '0x6501': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      '0x64F6': FeatureType.Int,
    },
    [AircraftFeature.LogoLight]: false,
    [AircraftFeature.NavigationLights]: {
      '0x6500': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      '0x6500': FeatureType.Int,
    },
    [AircraftFeature.TaxiLight]: {
      '0x64FA': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'b737', '')
    return ['pmdg', '737'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(value: number): FeatureState {
    return value === 1
  }

  navigationLights(value: number): FeatureState {
    return value === 0 || value === 2
  }

  strobeLights(value: number): FeatureState {
    return value === 2
  }

  taxiLights(value: number): FeatureState {
    return value === 1
  }
}
