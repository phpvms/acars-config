import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class FlyByWireA320N extends AircraftConfig {
  meta: Meta = {
    id: 'tbm_930',
    name: 'TBM 930',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'A:LIGHT LOGO,bool': FeatureType.Int,
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
}
