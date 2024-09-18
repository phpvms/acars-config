import { AircraftConfigSimType, AircraftFeature } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class AerosoftA333Airbus extends AircraftConfig {
  meta: Meta = {
    id: 'aerosoft_a333',
    name: 'aerosoft a333',
    sim: AircraftConfigSimType.Fsuipc,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: false,
    [AircraftFeature.LandingLights]: false,
    [AircraftFeature.NavigationLights]: false,
    [AircraftFeature.StrobeLights]: false,
    [AircraftFeature.TaxiLight]: false,
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: 'CONF 1',
    2: 'CONF 1+F',
    3: 'CONF 2',
    4: 'CONF 3',
    5: 'FULL',
  }

  /**
   *
   * @param {string} title The title of the aircraft, lowercased
   * @param {string=} icao The ICAO of the aircraft. Might not be available
   * @param {string=} config_path Path to the aircraft config. Might not be there
   * @return {boolean}
   */
  match(title: string, icao: string, config_path: string): boolean {
    // Should match aerosfot + a333/a3
    return ['aerosoft', 'a3'].every((w) => title.includes(w))
  }

  beaconLights(): FeatureState {
    return null
  }

  landingLights(): FeatureState {
    return null
  }

  navigationLights(): FeatureState {
    return null
  }

  strobeLights(): FeatureState {
    return null
  }

  taxiLights(): FeatureState {
    return null
  }
}
