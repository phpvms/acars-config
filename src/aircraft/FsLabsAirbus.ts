import { AircraftConfigSimType, AircraftFeature } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FlapNames,
  Meta,
} from '../interface/aircraft'

export default class FsLabsAirbus extends AircraftConfig {
  meta: Meta = {
    id: 'fslabs_airbus',
    name: 'FsLabs Airbus',
    sim: AircraftConfigSimType.Fsuipc,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: false,
    [AircraftFeature.LandingLights]: false,
    [AircraftFeature.LogoLight]: false,
    [AircraftFeature.NavigationLights]: false,
    [AircraftFeature.StrobeLights]: false,
    [AircraftFeature.TaxiLight]: false,
    [AircraftFeature.WingLights]: false,
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: 'CONF 1',
    2: 'CONF CHG',
    3: 'CONF CHG',
    4: 'CONF CHG',
    5: 'CONF CHG',
    6: 'CONF 1+F',
    7: 'CONF 2',
    8: 'CONF 3',
    9: 'FULL',
  }

  match(title: string, icao: string, config_path: string): boolean {
    return ['fslabs'].every((w) => title.includes(w))
  }
}
