import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class PMDG_747_FSUIPC extends AircraftConfig {
  meta: Meta = {
    id: 'pmdg_747_fsuipc',
    name: 'PMDG 747',
    sim: AircraftConfigSimType.Fsuipc,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      '0x650A': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      '0x6506': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: false,
    [AircraftFeature.NavigationLights]: {
      '0x650B': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      '0x6511': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      '0x6510': FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'b747', '')
    return ['pmdg', '747'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value == 0 || value == 2
  }

  landingLights(value: number): FeatureState {
    return value == 1
  }

  navigationLights(value: number): FeatureState {
    return value == 0 || value == 2
  }

  strobeLights(value: number): FeatureState {
    return value == 1
  }

  taxiLights(value: number): FeatureState {
    return value == 1
  }
}
