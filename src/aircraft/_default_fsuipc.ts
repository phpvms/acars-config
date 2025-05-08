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
export default class DefaultFsuipc extends AircraftConfig {
  meta: Meta = {
    id: 'fsuipc_default',
    name: 'fsuipc default',
    sim: AircraftConfigSimType.Fsuipc,
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
   * Set to "false" for the feature being disabled/not detected
   * Don't add an entry, or set it to null, to use the default
   */
  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: { '0x0D0C': FeatureType.Int },
    [AircraftFeature.LandingLights]: { '0x0D0C': FeatureType.Int },
    [AircraftFeature.LogoLights]: { '0x0D0C': FeatureType.Int },
    [AircraftFeature.NavigationLights]: { '0x0D0C': FeatureType.Int },
    [AircraftFeature.StrobeLights]: { '0x0D0C': FeatureType.Int },
    [AircraftFeature.TaxiLights]: { '0x0D0C': FeatureType.Int },
    [AircraftFeature.WingLights]: { '0x0D0C': FeatureType.Int },
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
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  beaconLights(value: number): FeatureState {
    return (2 & value) == 2
  }

  /**
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  landingLights(value: number): FeatureState {
    return (4 & value) == 4
  }

  /**
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  logoLights(value: number): FeatureState {
    return null
  }

  /**
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  navigationLights(value: number): FeatureState {
    return (1 & value) == 1
  }

  /**
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  strobeLights(value: number): FeatureState {
    return (16 & value) == 16
  }

  /**
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  taxiLights(value: number): FeatureState {
    return (8 & value) == 8
  }

  /**
   * Parse the value that's returned by the sim. Return null if disabled
   * @param value
   * @return {boolean|null}
   */
  wingLights(value: number): FeatureState {
    return null
  }
}
