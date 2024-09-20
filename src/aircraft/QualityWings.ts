import { AircraftConfigSimType, AircraftFeature } from '../defs'
import { AircraftConfig, FeatureAddresses, Meta } from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

export default class QualityWings extends AircraftConfig {
  meta: Meta = {
    id: 'qualitywings',
    name: 'QualityWings',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: false,
    [AircraftFeature.LandingLights]: false,
    [AircraftFeature.NavigationLights]: false,
    [AircraftFeature.StrobeLights]: false,
    [AircraftFeature.TaxiLights]: false,
  }

  /**
   *
   * @param {string} title The title of the aircraft, lowercased
   * @param {string=} icao The ICAO of the aircraft. Might not be available
   * @param {string=} config_path Path to the aircraft config. Might not be there
   * @return {boolean}
   */
  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps('', 'b787', '')
    return (
      title.includes('qualitywings') ||
      (title.includes('quality') && title.includes('wings'))
    )
  }
}
