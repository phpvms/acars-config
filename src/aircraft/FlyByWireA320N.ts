import { AircraftConfigSimType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class FlyByWireA320N extends AircraftConfig {
  meta: Meta = {
    id: 'flybywire_a320n',
    name: 'FlyByWire A320N',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 2,
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
    return ['a320', 'neo', 'flybywire'].every((w) => title.includes(w))
  }
}
