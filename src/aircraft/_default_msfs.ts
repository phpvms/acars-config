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
    [AircraftFeature.BeaconLights]: {
      LIGHTING_BEACON_1: FeatureType.Bool,
    },
    [AircraftFeature.LandingLights]: {
      LIGHTING_LANDING_1: FeatureType.Bool,
    },
    [AircraftFeature.NavigationLights]: {
      LIGHTING_NAV_1: FeatureType.Bool,
    },
    [AircraftFeature.StrobeLights]: {
      LIGHTING_STROBE_1: FeatureType.Bool,
    },
    [AircraftFeature.TaxiLight]: { LIGHTING_TAXI_1: FeatureType.Bool },
    [AircraftFeature.WingLights]: {
      LIGHTING_RECOGNITION_1: FeatureType.Bool,
    },
    [AircraftFeature.LogoLight]: { LIGHTING_BEACON_1: FeatureType.Bool },
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

  beaconLights = (value: boolean): FeatureState => value

  landingLights = (value: boolean): FeatureState => value

  navigationLights = (value: boolean): FeatureState => value

  strobeLights = (value: boolean): FeatureState => value

  taxiLights = (value: boolean): FeatureState => value

  wingLights = (value: boolean): FeatureState => value
}
