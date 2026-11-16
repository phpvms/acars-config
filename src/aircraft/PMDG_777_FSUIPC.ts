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
    // PMDG SDK switch fields are single bytes packed back to back. An Int read
    // is four bytes, so it swallows the neighbouring switches and `== 1` fails as
    // soon as any of them is on (landing: the other two landing lights + beacon;
    // beacon: nav/logo/wing; taxi: strobe). Read them as bytes.
    [AircraftFeature.BeaconLights]: {
      '0x6488': FeatureType.Byte,
    },
    // LTS_LandingLights_Sw_ON[3]: left/right/nose, three bytes at 0x6485-0x6487.
    // Read all three (plus the beacon byte at 0x6488) in one Int and mask it.
    [AircraftFeature.LandingLights]: {
      '0x6485': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: false,
    // 0x650B is the 747 nav switch; on the 777 that address is the chronograph.
    [AircraftFeature.NavigationLights]: {
      '0x6489': FeatureType.Byte,
    },
    [AircraftFeature.StrobeLights]: {
      '0x648F': FeatureType.Byte,
    },
    [AircraftFeature.TaxiLights]: {
      '0x648E': FeatureType.Byte,
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
    return value == 1
  }

  landingLights(value: number): FeatureState {
    // Any of the three landing-light bytes on; the top byte is the beacon.
    return (value & 0xffffff) != 0
  }

  navigationLights(value: number): FeatureState {
    return value == 1
  }

  strobeLights(value: number): FeatureState {
    return value == 1
  }

  taxiLights(value: number): FeatureState {
    return value == 1
  }
}
