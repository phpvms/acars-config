import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class PMDG_737_MSFS extends AircraftConfig {
  meta: Meta = {
    id: 'pmdg_737_msfs',
    name: 'PMDG 737',
    sim: AircraftConfigSimType.MsFs,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      switch_124_73X: FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      switch_113_73X: FeatureType.Int,
      switch_114_73X: FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      switch_122_73X: FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      switch_123_73X: FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      switch_123_73X: FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      switch_117_73X: FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      switch_125_73X: FeatureType.Int,
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
    return value === 100
  }

  landingLights(v1: number, v2: number): FeatureState {
    return v1 === 100 && v2 === 100
  }

  logoLights(value: number): FeatureState {
    return value === 100
  }

  navigationLights(value: number): FeatureState {
    return value === 0 || value === 100
  }

  strobeLights(value: number): FeatureState {
    return value === 0
  }

  taxiLights(value: number): FeatureState {
    return value === 100
  }

  wingLights(value: number): FeatureState {
    return value === 100
  }
}
