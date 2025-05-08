import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class FlightFactor757 extends AircraftConfig {
  meta: Meta = {
    id: 'flightfactor-757',
    name: 'FlightFactor 757',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'sim/cockpit2/switches/beacon_on': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'sim/cockpit2/switches/landing_lights_switch': FeatureType.NumberArray,
    },
    [AircraftFeature.LogoLights]: {
      'sim/cockpit2/switches/generic_lights_switch': FeatureType.NumberArray,
    },
    [AircraftFeature.NavigationLights]: {
      'sim/cockpit2/switches/navigation_lights_on': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'sim/cockpit2/switches/strobe_lights_on': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'sim/cockpit2/switches/landing_lights_switch': FeatureType.NumberArray,
    },
    [AircraftFeature.WingLights]: {
      'sim/cockpit2/switches/generic_lights_switch': FeatureType.NumberArray,
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
    this.flapNames = GetDefaultFlaps('', 'B757', '')
    return ['boeing', '757'].every((w) => title.includes(w))
  }

  beaconLights(value: number): FeatureState {
    return value == 1
  }

  landingLights(value: number[]): FeatureState {
    return value[0] == 1 && value[1] == 1
  }

  logoLights(value: number[]): FeatureState {
    return value[3] == 1
  }

  navigationLights(value: number): FeatureState {
    return value == 1
  }

  strobeLights(value: number): FeatureState {
    return value == 1
  }

  taxiLights(value: number[]): FeatureState {
    return value[2] == 1
  }

  wingLights(value: number[]): FeatureState {
    return value[0] == 1
  }
}
