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
    // PMDG SDK switch fields are single bytes packed back to back. An Int read
    // is four bytes, so it swallows the neighbouring switches and `== 1` fails as
    // soon as any of them is on. Read them as bytes.
    [AircraftFeature.BeaconLights]: {
      '0x650A': FeatureType.Byte,
    },
    // LTS_LandingLights_Sw_ON[4]: four bytes at 0x6506-0x6509, so one Int read
    // covers exactly the four switches.
    [AircraftFeature.LandingLights]: {
      '0x6506': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: false,
    [AircraftFeature.NavigationLights]: {
      '0x650B': FeatureType.Byte,
    },
    [AircraftFeature.StrobeLights]: {
      '0x6511': FeatureType.Byte,
    },
    [AircraftFeature.TaxiLights]: {
      '0x6510': FeatureType.Byte,
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
    // Any of the four landing-light switches on.
    return value != 0
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
