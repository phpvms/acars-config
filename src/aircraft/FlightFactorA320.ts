import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class FlightFactorA320 extends AircraftConfig {
  meta: Meta = {
    id: 'flightfactor-a320',
    name: 'FlightFactor A320',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
    author: 'B.Fatih KOZ <https://github.com/FatihKoz>',
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'model/controls/light_beacon': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'model/controls/light_land1': FeatureType.Number,
      'model/controls/light_land2': FeatureType.Number,
    },
    [AircraftFeature.NavigationLights]: {
      'model/controls/light_logo': FeatureType.Number,
    },
    [AircraftFeature.StrobeLights]: {
      'model/controls/light_strobe': FeatureType.Number,
    },
    [AircraftFeature.TaxiLight]: {
      'model/controls/light_nose': FeatureType.Number,
    },
    [AircraftFeature.WingLights]: {
      'model/controls/light_wing': FeatureType.Int,
    },
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: 'CONF 1',
    2: 'CONF 2',
    3: 'CONF 3',
    4: 'FULL',
  }

  match(title: string, icao: string, config_path: string): boolean {
    return ['flightfactor', 'a320'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(left: number, right: number): FeatureState {
    // Dataref returns 0.5 or 1 when enabled, 0.5 is landing lights extended but off
    return Math.floor(left * 10) === 10 && Math.floor(right * 10) === 10
  }

  navigationLights(value: number): FeatureState {
    // Dataref returns 0.5 or 1 when enabled
    return value > 0
  }

  strobeLights(value: number): FeatureState {
    if (value > 0 && value < 1) {
      // Ignore if switch is set to AUTO, dataref returns 0.5
      return null
    }

    return value === 1
  }

  taxiLights(value: number): FeatureState {
    // Dataref returns 0.5 or 1 when enabled
    return value > 0
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }
}
