import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  Meta,
} from '../interface/aircraft'
import GetDefaultFlaps from './_default_flaps'

/**
 * LevelUp 737NG Series V2 for X-Plane 12
 * Uses laminar/B738 datarefs (LevelUp is based on Laminar default B738)
 * Matches: Boeing 737-600NG, 737-700NG, 737-800NG, 737-900NG
 */
export default class LevelUp737NG extends AircraftConfig {
  meta: Meta = {
    id: 'levelup_737ng_v2',
    name: 'LevelUp 737NG V2',
    sim: AircraftConfigSimType.XPlane,
    enabled: true,
    priority: 6,
    author: 'Coljet',
  }
  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'sim/cockpit/electrical/beacon_lights_on': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'sim/cockpit2/switches/landing_lights_on': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'sim/cockpit2/switches/navigation_lights_on': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'sim/cockpit2/switches/strobe_lights_on': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'laminar/B738/toggle_switch/taxi_light_brightness_pos': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'laminar/B738/toggle_switch/wing_light': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'laminar/B738/toggle_switch/logo_light': FeatureType.Int,
    },
    [AircraftFeature.Flaps]: {
      'sim/cockpit2/controls/flap_ratio': FeatureType.Number,
    },
    [AircraftFeature.ParkingBrakes]: {
      'sim/cockpit2/controls/parking_brake_ratio': FeatureType.Number,
    },
    [AircraftFeature.Engines]: {
      'sim/flightmodel/engine/ENGN_running': FeatureType.IntArray,
    },
    [AircraftFeature.APU]: {
      'laminar/B738/spring_toggle_switch/APU_start_pos': FeatureType.Int,
    },
    [AircraftFeature.Autopilot]: {
      'laminar/B738/autopilot/cmd_b_status': FeatureType.Int,
    },
    [AircraftFeature.Seatbelts]: {
      'laminar/B738/toggle_switch/seatbelt_sign_pos': FeatureType.Int,
    },
    [AircraftFeature.AntiIce]: {
      'laminar/B738/ice/wing_heat_pos': FeatureType.Int,
    },
    [AircraftFeature.Transponder]: {
      'laminar/B738/knob/transponder_pos': FeatureType.Int,
    },
  }

  match(title: string, icao: string, config_path: string): boolean {
    this.flapNames = GetDefaultFlaps(title, 'b737', config_path)
    // Title comes in lowercased. Match any LevelUp 737NG variant:
    // "boeing 737-600ng", "boeing 737-700ng", "boeing 737-800ng", "boeing 737-900ng"
    const titleMatch = /737.?[6789]00.?ng|b737.?[6789]00/i.test(title)
    const icaoMatch = /b73[6789]/i.test(icao)
    return titleMatch || icaoMatch
  }

  beaconLights(value: number): FeatureState {
    return value === 1
  }

  landingLights(value: number): FeatureState {
    return value === 1
  }

  navigationLights(value: number): FeatureState {
    return value === 1
  }

  strobeLights(value: number): FeatureState {
    return value === 1
  }

  taxiLights(value: number): FeatureState {
    // 0=off, 1=taxi, 2=taxi+rwy turnoff
    return value > 0
  }

  wingLights(value: number): FeatureState {
    return value === 1
  }

  logoLights(value: number): FeatureState {
    return value === 1
  }

  flaps(value: number): string | number {
    return value
  }

  parkingBrakes(value: number): FeatureState {
    return value > 0
  }

  engines(value: number | number[]): FeatureState {
    // Array value, return if any engine running (first is checked)
    return Array.isArray(value) ? value.includes(1) : value === 1
  }

  autopilot(value: number): FeatureState {
    return value === 1
  }

  apu(value: number): FeatureState {
    return value === 1
  }

  seatbelts(value: number): FeatureState {
    return value > 0
  }

  antiIce(value: number): FeatureState {
    return value > 0
  }

  transponder(value: number): FeatureState {
    // 0=off, 1=stby, 2=xpndr, 3=TA, 4=TA/RA
    return value > 1
  }
}