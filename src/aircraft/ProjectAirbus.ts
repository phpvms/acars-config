import { AircraftConfigSimType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class ProjectAirbus extends AircraftConfig {
  meta: Meta = {
    id: 'project_airbus',
    name: 'Project Airbus',
    sim: AircraftConfigSimType.XPlane,
    priority: 2,
    enabled: true,
  }

  features: FeatureAddresses = {}

  flapNames: FlapNames = {
    0: 'UP',
    1: 'CONF 1',
    2: 'CONF 1+F',
    3: 'CONF 2',
    4: 'CONF 3',
    5: 'FULL',
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
    return ['project', 'airbus', 'a3'].every((w) => title.includes(w))
  }
}
