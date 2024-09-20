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
export default class DefaultXPlane extends AircraftConfig {
  meta: Meta = {
    id: 'xplane_default',
    name: 'xplane default',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 1,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'sim/cockpit2/switches/beacon_on': FeatureType.Bool,
    },
    [AircraftFeature.LandingLights]: {
      'sim/cockpit2/switches/landing_lights_on': FeatureType.Bool,
    },
    [AircraftFeature.LogoLights]: {
      'sim/cockpit2/switches/logo_lights_on': FeatureType.Bool,
    },
    [AircraftFeature.NavigationLights]: {
      'sim/cockpit2/switches/navigation_lights_on': FeatureType.Bool,
    },
    [AircraftFeature.StrobeLights]: {
      'sim/cockpit2/switches/strobe_lights_on': FeatureType.Bool,
    },
    [AircraftFeature.TaxiLights]: {
      'sim/cockpit2/switches/taxi_light_on': FeatureType.Bool,
    },
    [AircraftFeature.WingLights]: {
      'sim/cockpit2/switches/wing_lights_on': FeatureType.Bool,
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
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  beaconLights(value: number): FeatureState {
    return value === 1
  }

  /**
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  landingLights(value: number): FeatureState {
    return value === 1
  }

  /**
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  navigationLights(value: number): FeatureState {
    return value === 1
  }

  /**
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  strobeLights(value: number): FeatureState {
    return value === 1
  }

  /**
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  taxiLights(value: number): FeatureState {
    return value === 1
  }

  /**
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  wingLights(value: number): FeatureState {
    return value === 1
  }

  /*s*
   * Parse the value that's returned by the sim
   * @param value
   * @return {boolean|null}
   */
  logoLights(value: number): FeatureState {
    return value === 1
  }
}
