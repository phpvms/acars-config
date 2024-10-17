import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class IFlyB38M_MSFS extends AircraftConfig {
  meta: Meta = {
    id: 'ifly_b38M_msfs',
    name: 'iFLY B737-MAX8',
    author: 'B.Fatih KOZ <https://github.com/FatihKoz>',
    sim: AircraftConfigSimType.MsFs,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      VC_Beacon_Light_SW: FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      VC_Landing_Light_1_SW: FeatureType.Int,
      VC_Landing_Light_2_SW: FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      VC_Logo_Light_SW: FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      VC_Position_Light_SW: FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      VC_Position_Light_SW: FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      VC_Taxi_Light_SW: FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      VC_Wing_Light_SW: FeatureType.Int,
    },
  }

  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps('', 'b737', '')
    return ['ifly', '737-max8'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value === 10
  }

  landingLights(v1: number, v2: number): FeatureState {
    return v1 === 20 && v2 === 20
  }

  navigationLights(value: number): FeatureState {
    return value === 0 || value === 20
  }

  strobeLights(value: number): FeatureState {
    return value === 0
  }

  taxiLights(value: number): FeatureState {
    // Off = 0 , On = 10
    return value === 10
  }
  wingLights(value: number): FeatureState {
    // Off = 0 , On = 10
    return value === 10
  }
}
