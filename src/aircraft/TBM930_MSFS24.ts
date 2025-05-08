import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class TBM930_MSFS24 extends AircraftConfig {
  meta: Meta = {
    id: 'tbm_930_2024',
    name: 'TBM 930 2024',
    sim: AircraftConfigSimType.MsFs24,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: false,
    [AircraftFeature.TaxiLights]: {
      'A:LIGHT TAXI,bool': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'A:LIGHT LANDING,bool': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: false,
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: 'TO',
    2: 'LDG',
  }

  match(title: string, icao: string, config_path: string): boolean {
    return title.includes('tbm') && title.includes('930')
  }

  beaconLights(value: number): FeatureState {
    return value == 1
  }

  landingLights(value: number): FeatureState {
    return value == 1
  }

  taxiLights(value: number): FeatureState {
    return value == 1
  }
}
