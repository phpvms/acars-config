import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class Felis742 extends AircraftConfig {
  meta: Meta = {
    id: 'felis_742',
    name: 'Felis 742',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: false,
    [AircraftFeature.LandingLights]: {
      'B742/ext_light/landing_inbd_L_sw': FeatureType.Int,
      'B742/ext_light/landing_inbd_R_sw': FeatureType.Int,
      'B742/ext_light/landing_outbd_L_sw': FeatureType.Int,
      'B742/ext_light/landing_outbd_R_sw': FeatureType.Int,
    },
    [AircraftFeature.LogoLight]: {
      'B742/ext_light/logo_sw': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: false,
    [AircraftFeature.StrobeLights]: false,
    [AircraftFeature.TaxiLight]: {
      'B742/ext_light/runway_turnoff_L_sw': FeatureType.Int,
      'B742/ext_light/runway_turnoff_R_sw': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'B742/ext_light/wing_sw': FeatureType.Int,
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
    return ['boeing', '747-200'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return null
  }

  landingLights(
    inbd_l: number,
    inbd_r: number,
    outb_l: number,
    outb_r: number,
  ): FeatureState {
    return inbd_l === 1 && inbd_r === 1 && outb_l === 1 && outb_r === 1
  }

  logoLights(value: number): FeatureState {
    return value === 1
  }

  navigationLights(value: number): FeatureState {
    return null
  }

  strobeLights(value: number): FeatureState {
    return null
  }

  taxiLights(turnoff_l: number, turnoff_r: number): FeatureState {
    return turnoff_l === 1 && turnoff_r === 1
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }
}
