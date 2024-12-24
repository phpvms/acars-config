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
    [AircraftFeature.LogoLights]: {
      S_OH_EXT_LT_NAV_LOGO: FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      S_OH_EXT_LT_NAV_LOGO: FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      S_OH_EXT_LT_STROBE: FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      S_OH_EXT_LT_NOSE: FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      S_OH_EXT_LT_WING: FeatureType.Int,
    },
    [AircraftFeature.EmergencyLights]: {
      S_OH_INT_LT_EMER: FeatureType.Int,
    },
    [AircraftFeature.Seatbelts]: {
      S_OH_SIGNS: FeatureType.Int,
    },
    [AircraftFeature.Battery]: {
      S_OH_ELEC_BAT1: FeatureType.Int,
      S_OH_ELEC_BAT2: FeatureType.Int,
      I_OH_ELEC_EXT_PWR_L: FeatureType.Int,
    },
    [AircraftFeature.APU]: {
      S_OH_ELEC_APU_MASTER: FeatureType.Int,
      I_OH_ELEC_APU_START_U: FeatureType.Int,
    },
    [AircraftFeature.Packs]: {
      S_OH_PNEUMATIC_PACK_1: FeatureType.Int,
      I_OH_PNEUMATIC_PACK_1_U: FeatureType.Int,
      S_OH_PNEUMATIC_PACK_2: FeatureType.Int,
      I_OH_PNEUMATIC_PACK_2_U: FeatureType.Int,
    },
    [AircraftFeature.Doors]: {
      Any_Exit_open_L: FeatureType.Int,
      Any_Exit_open_R: FeatureType.Int,
    },
    [AircraftFeature.AntiIce]: {
      S_OH_PNEUMATIC_WING_ANTI_ICE: FeatureType.Int,
      S_OH_PNEUMATIC_ENG1_ANTI_ICE: FeatureType.Int,
      S_OH_PNEUMATIC_ENG2_ANTI_ICE: FeatureType.Int,
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
    if (!title.includes('fenix')) {
      return false
    }

    return ['a319', 'a320', 'a321'].some((w) => title.includes(w))
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

  taxiLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }

  emergencyLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  seatbelts(value: number): FeatureState {
    return value === 1
  }

  battery(b1: number, b2: number, ext_pwr: number): FeatureState {
    return (b1 === 1 && b2 === 1) || ext_pwr === 1
  }

  apu(master_switch: number, avail_status: number): FeatureState {
    return master_switch === 1 && avail_status === 1
  }

  packs(
    left_switch: number,
    left_message: number,
    right_switch: number,
    right_message: number,
  ): FeatureState {
    return (
      (left_switch === 1 && left_message === 0) ||
      (right_switch === 1 && right_message === 0)
    )
  }

  doors(exits_left: number, exits_right: number): FeatureState {
    return exits_left === 0 && exits_right === 0
  }

  antiIce(wing: number, eng1: number, eng2: number): FeatureState {
    return wing === 1 || (eng1 === 1 && eng2 === 1)
  }
}
