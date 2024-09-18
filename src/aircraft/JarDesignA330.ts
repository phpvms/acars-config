import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class JarDesignA330 extends AircraftConfig {
  meta: Meta = {
    id: 'jardesign_a330',
    name: 'JARDesign A330',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'sim/custom/xap/extlight/beacon_sw': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'sim/custom/xap/extlight/land_sw': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'sim/custom/xap/extlight/navlogo_sw': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'sim/custom/xap/extlight/strobe_sw': FeatureType.Int,
    },
    [AircraftFeature.TaxiLight]: {
      'sim/custom/xap/extlight/nose_sw': FeatureType.Int,
    },
  }

  /**
   * Determine if this config map should be used for the given aircraft
   *
   * @param {string} title The title of the aircraft, lowercased
   * @param {string=} icao The ICAO of the aircraft. Might not be available
   * @param {string=} config_path Path to the aircraft config. Might not be there
   * @return {boolean}
   */
  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps('', 'a330', '')
    return ['jardesign', 'a330'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(value: number): FeatureState {
    return value === 1
  }

  navigationLights(value: number): FeatureState {
    return value === 1 || value === 2
  }

  strobeLights(value: number): FeatureState {
    return value === 2
  }

  taxiLights(value: number): FeatureState {
    return value === 1 || value === 2
  }
}
