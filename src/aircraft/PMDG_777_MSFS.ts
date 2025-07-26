import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class PMDG_777_MSFS extends AircraftConfig {
  meta: Meta = {
    id: 'pmdg_777_msfs',
    name: 'PMDG 777',
    sim: AircraftConfigSimType.MsFs,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      switch_114_a: FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      switch_22_a: FeatureType.Int,
      switch_23_a: FeatureType.Int,
      switch_24_a: FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      switch_116_a: FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      switch_115_a: FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      switch_122_a: FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      switch_121_a: FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      switch_117_a: FeatureType.Int,
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
    this.flapNames = GetDefaultFlaps('', 'b777', '')
    return ['pmdg', '777'].every(
      (w) => title.includes(w) || config_path.includes(w),
    )
  }

  beaconLights(value: number): FeatureState {
    return value == 100
  }

  landingLights(s1: number, s2: number, s3: number): FeatureState {
    return s1 == 100 && s2 == 100 && s3 == 100
  }

  logoLights(value: number): FeatureState {
    return value == 100
  }

  navigationLights(value: number): FeatureState {
    return value == 100
  }

  strobeLights(value: number): FeatureState {
    return value == 100
  }

  taxiLights(value: number): FeatureState {
    return value == 100
  }

  wingLights(value: number): FeatureState {
    return value == 100
  }
}
