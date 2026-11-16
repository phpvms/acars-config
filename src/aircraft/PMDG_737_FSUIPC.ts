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
      '0x6501': FeatureType.Byte,
    },
    [AircraftFeature.LandingLights]: {
      // One 4-byte read covers the four 1-byte landing switches that sit back to back:
      // 0x64F4/0x64F5 LTS_LandingLtRetractableSw[2] (0 retract, 1 extend, 2 on),
      // 0x64F6/0x64F7 LTS_LandingLtFixedSw[2] (boolean). The previous config only
      // read the left fixed switch.
      '0x64F4': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      '0x64FF': FeatureType.Byte,
    },
    [AircraftFeature.NavigationLights]: {
      '0x6500': FeatureType.Byte,
    },
    [AircraftFeature.StrobeLights]: {
      '0x6500': FeatureType.Byte,
    },
    [AircraftFeature.TaxiLights]: {
      '0x64FA': FeatureType.Byte,
    },
    [AircraftFeature.WingLights]: {
      '0x6502': FeatureType.Byte,
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
    this.flapNames = GetDefaultFlaps('', 'b737', '')
    return ['pmdg', '737'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value == 1
  }

  landingLights(value: number): FeatureState {
    const retractableLeft = value & 0xff
    const retractableRight = (value >> 8) & 0xff
    const fixedLeft = (value >> 16) & 0xff
    const fixedRight = (value >>> 24) & 0xff
    return (
      retractableLeft == 2 ||
      retractableRight == 2 ||
      fixedLeft != 0 ||
      fixedRight != 0
    )
  }

  logoLights(value: number): FeatureState {
    return value == 1
  }

  navigationLights(value: number): FeatureState {
    return value == 0 || value == 2
  }

  strobeLights(value: number): FeatureState {
    return value == 2
  }

  taxiLights(value: number): FeatureState {
    return value == 1
  }

  wingLights(value: number): FeatureState {
    return value == 1
  }
}
