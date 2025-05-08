import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class IniBuildsA350 extends AircraftConfig {
  meta: Meta = {
    id: 'inibuilds_a350',
    name: 'IniBuilds Airbus A359/A35K',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 2,
    author: 'Arthur Parienté <https://github.com/arthurpar06>'
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      INI_LIGHTS_BEACON: FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      INI_LIGHTS_LANDING: FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      INI_LIGHTS_LOGO: FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      INI_LIGHTS_NAV: FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      INI_LIGHTS_STROBE: FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      INI_LIGHTS_NOSE: FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      INI_LIGHTS_WING: FeatureType.Int,
    },
    [AircraftFeature.EmergencyLights]: {
      INI_EMER_EXIT_SWITCH: FeatureType.Int
    },
    [AircraftFeature.Seatbelts]: {
      INI_SEATBELTS_SWITCH: FeatureType.Int,
    },
    [AircraftFeature.APU]: {
      INI_APU_MASTER_SWITCH: FeatureType.Int,
      INI_APU_START_BUTTON: FeatureType.Int,
    },
    [AircraftFeature.Battery]: {
      INI_BATTERY_1_SWITCH: FeatureType.Int,
      INI_BATTERY_2_SWITCH: FeatureType.Int,
      INI_BATTERY_EMER1_SWITCH: FeatureType.Int,
      INI_BATTERY_EMER2_SWITCH: FeatureType.Int,
      INI_GEN_EXT1_SWITCH: FeatureType.Int,
      INI_GEN_EXT2_SWITCH: FeatureType.Int,
    },
    [AircraftFeature.Packs]: {
      INI_AIR_PACK1_BUTTON: FeatureType.Int,
      INI_AIR_PACK2_BUTTON: FeatureType.Int,
    },
    [AircraftFeature.AntiIce]: {
      INI_WING_ANTI_ICE1_STATE: FeatureType.Int,
      INI_ENG_ANTI_ICE1_STATE: FeatureType.Int,
      INI_ENG_ANTI_ICE2_STATE: FeatureType.Int,
    }
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
    return ['a350-900', 'a350-1000'].some((w) => title === w)
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(value: number): FeatureState {
    return value === 1
  }

  logoLights(value: number): FeatureState {
    return value >= 1
  }

  navigationLights(value: number): FeatureState {
    return value >= 1
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
    return value >= 1
  }

  apu(mastersw: number, startsw: number): FeatureState {
    return mastersw === 1 && startsw === 2
  }

  battery(b1: number, b2: number, emer1: number, emer2: number, ext1: number, ext2: number): FeatureState {
      return (b1 === 1 && b2 === 1 && emer1 === 1 && emer2 === 1) || (ext1 === 1 && ext2 === 1)
  }

  emergencyLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  seatbelts(value: number): FeatureState {
    return value >= 1
  }

  antiIce(wing: number, eng1: number, eng2: number): FeatureState {
    return wing === 1 || (eng1 === 1 && eng2 === 1)
  }

  packs(p1: number, p2: number) {
    return p1 === 1 || p2 === 2
  }
}
