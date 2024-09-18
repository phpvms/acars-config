import { AircraftConfigSimType, AircraftFeature } from '../defs'
import { AircraftConfig, FeatureAddresses, Meta } from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class ProSim737 extends AircraftConfig {
  meta: Meta = {
    id: 'prosim_737',
    name: 'Prosim 737',
    sim: AircraftConfigSimType.MsFs,
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

  /**
   *
   * @param {string} title The title of the aircraft, lowercased
   * @param {string=} icao The ICAO of the aircraft. Might not be available
   * @param {string=} config_path Path to the aircraft config. Might not be there
   * @return {boolean}
   */
  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps('', 'b737', '')
    return title.includes('prosim')
  }
}
