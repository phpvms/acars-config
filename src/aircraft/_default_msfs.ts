import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

/**
 * The default configmap
 */
export default class DefaultMsFs extends AircraftConfig {
  meta: Meta = {
    id: 'msfs default',
    name: 'msfs default',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 1,
  }

  /**
   * Individual mappings go here.
   *
   * FSUIPC is an offset
   * X-Plane is a dataref
   * MSFS is an LVar
   *
   * Set to null to ignore the feature
   */
  features: FeatureAddresses = {
    [AircraftFeature.Autopilot]: {
      'A:AUTOPILOT MASTER,bool': FeatureType.Bool,
      'A:AUTOPILOT DISENGAGED,bool': FeatureType.Bool,
    },
    [AircraftFeature.APU]: {
      'A:APU SWITCH,bool': FeatureType.Bool,
    },
    [AircraftFeature.Battery]: {
      'A:ELECTRICAL MASTER BATTERY:0,bool': FeatureType.Bool,
      'A:BATTERY CONNECTION ON:0,bool': FeatureType.Bool,
    },
    [AircraftFeature.BeaconLights]: {
      'A:LIGHT BEACON,bool': FeatureType.Bool,
    },
    [AircraftFeature.ExternalPower]: {
      'A:EXTERNAL POWER ON,bool': FeatureType.Bool,
    },
    [AircraftFeature.LandingLights]: {
      'A:LIGHT LANDING,bool': FeatureType.Bool,
    },
    [AircraftFeature.LogoLights]: {
      'A:LIGHT LOGO,bool': FeatureType.Bool,
    },
    [AircraftFeature.NavigationLights]: {
      'A:LIGHT NAV,bool': FeatureType.Bool,
    },
    [AircraftFeature.StrobeLights]: {
      'A:LIGHT STROBE,bool': FeatureType.Bool,
    },
    [AircraftFeature.TaxiLights]: {
      'A:LIGHT TAXI,bool': FeatureType.Bool,
    },
    [AircraftFeature.Transponder]: {
      'A:TRANSPONDER CODE:1,enum': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'A:LIGHT RECOGNITION,bool': FeatureType.Bool,
    },
  }

  /**
   * See if the title, icao or config_path match with what the simulator
   * is saying. All of the values are passed in already lower-cased.
   * Return true or false
   *
   * The ICAO and config_path may not be available in some sims.
   *
   * @param {string} title The title of the aircraft
   * @param {string=} icao The ICAO of the aircraft. Might not be available
   * @param {string=} config_path Path to the aircraft config. Might not be there
   * @return {boolean}
   */
  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps(title, icao, config_path)
    return true
  }

  /**
   * @param value
   */
  apu(value: boolean): FeatureState {
    return value
  }

  /**
   * @param master
   * @param disengaged "AUTOPILOT DISENGAGED"
   */
  autopilot(master: boolean, disengaged: boolean): FeatureState {
    return master && !disengaged
  }

  /**
   * @param master "ELECTRICAL MASTER BATTERY"
   * @param connection "BATTERY CONNECTION ON"
   */
  battery(master: boolean, connection: boolean): FeatureState {
    return master && connection
  }

  /**
   * Is the external power connected?
   * @param externalOn EXTERNAL POWER ON
   */
  externalPower(externalOn: boolean): FeatureState {
    return externalOn
  }

  /**
   * @param value
   */
  beaconLights(value: boolean): FeatureState {
    return value
  }

  /**
   * @param value
   */
  landingLights(value: boolean): FeatureState {
    return value
  }

  /**
   * @param value
   */
  navigationLights(value: boolean): FeatureState {
    return value
  }

  /**
   * @param value
   */
  strobeLights(value: boolean): FeatureState {
    return value
  }

  /**
   * @param value
   */
  taxiLights(value: boolean): FeatureState {
    return value
  }

  transponder(value: number): FeatureState {
    return value > 0
  }

  /**
   * @param value
   */
  wingLights(value: boolean): FeatureState {
    return value
  }
}
