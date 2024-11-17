import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class Toliss extends AircraftConfig {
  meta: Meta = {
    id: 'toliss_airbus',
    name: 'ToLiss Airbus',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
    author: 'B.Fatih KOZ <https://github.com/FatihKoz>',
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.LandingLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.LogoLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.NavigationLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.StrobeLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.TaxiLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.WingLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.EmergencyLights]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.Seatbelts]: {
      'AirbusFBW/OHPLightSwitches': FeatureType.IntArray,
    },
    [AircraftFeature.Battery]: {
      'AirbusFBW/BatOHPArray': FeatureType.IntArray,
    },
    [AircraftFeature.APU]: {
      'AirbusFBW/APUAvail': FeatureType.Int,
    },
    [AircraftFeature.Packs]: {
      'AirbusFBW/Pack1Flow': FeatureType.Int,
      'AirbusFBW/Pack2Flow': FeatureType.Int,
    },
    [AircraftFeature.Doors]: {
      'AirbusFBW/PaxDoorArray': FeatureType.IntArray,
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
    return ['high', 'fidelity', 'system'].every((w) => title.includes(w))
  }

  beaconLights(value: number[]): FeatureState {
    return value[0] === 1
  }

  landingLights(value: number[]): FeatureState {
    return value[4] === 2 && value[5] === 2
  }

  logoLights(value: number[]): FeatureState {
    return value[2] === 1 || value[2] === 2
  }

  navigationLights(value: number[]): FeatureState {
    return value[2] === 1 || value[2] === 2
  }

  wingLights(value: number[]): FeatureState {
    return value[1] === 1
  }

  emergencyLights(value: number[]): FeatureState {
    return value[10] === 1 || value[10] === 2
  }

  seatbelts(value: number[]): FeatureState {
    return value[11] === 1
  }

  strobeLights(value: number[]): FeatureState {
    // Ignore if the switch is on AUTO position
    if (value[7] === 1) {
      return null
    }

    return value[7] === 2
  }

  taxiLights(value: number[]): FeatureState {
    return value[3] === 1 || value[3] === 2
  }

  battery(value: number[]): FeatureState {
    return value[0] === 1 && value[1] === 1
  }

  APU(value: number): FeatureState {
    return value === 1
  }

  packs(p1: number, p2: number): FeatureState {
    return p1 > 0.5 || p2 > 0.5
  }

  doors(doors: number[]): FeatureState {
    return !doors.includes(1)
  }
}
