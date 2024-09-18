import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class FenixA320 extends AircraftConfig {
  meta: Meta = {
    id: 'fenix_a320',
    name: 'Fenix Airbus A319/A320/A321',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 2,
    author: 'B.Fatih KOZ <https://github.com/FatihKoz>',
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      S_OH_EXT_LT_BEACON: FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      S_OH_EXT_LT_LANDING_L: FeatureType.Int,
      S_OH_EXT_LT_LANDING_R: FeatureType.Int,
    },
    [AircraftFeature.LogoLight]: {
      S_OH_EXT_LT_NAV_LOGO: FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      S_OH_EXT_LT_NAV_LOGO: FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      S_OH_EXT_LT_STROBE: FeatureType.Int,
    },
    [AircraftFeature.TaxiLight]: {
      S_OH_EXT_LT_NOSE: FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      S_OH_EXT_LT_WING: FeatureType.Int,
    },
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: 'CONF 1',
    2: 'CONF 1+F',
    3: 'CONF 2',
    4: 'CONF 3',
    5: 'FULL',
  }

  match(title: string, icao: string, config_path: string): boolean {
    return (
      ['Fenix', 'A320'].every((w) => title.includes(w)) ||
      ['FenixA320'].every((w) => title.includes(w)) ||
      ['Fenix', 'A321'].every((w) => title.includes(w.toLowerCase())) ||
      ['FenixA319'].every((w) => title.includes(w.toLowerCase())) ||
      ['FenixA320'].every((w) => title.includes(w.toLowerCase())) ||
      ['FenixA321'].every((w) => title.includes(w.toLowerCase()))
    )
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(left: number, right: number): FeatureState {
    return left === 2 && right === 2
  }

  logoLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  navigationLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  strobeLights(value: number): FeatureState {
    if (value === 1) {
      return null
    }

    return value === 2
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }

  taxiLights(value: number): FeatureState {
    return value === 1 || value === 2
  }
}
