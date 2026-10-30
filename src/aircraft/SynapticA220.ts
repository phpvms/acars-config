import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
  AircraftConfig,
  FeatureAddresses,
  FeatureState,
  FlapNames,
  Meta,
} from '../interface/aircraft'

/**
 * Synaptic Simulations A220 (MSFS)
 * SimVars: https://docs.synapticsim.com/pilots/simvars
 *
 * The docs describe the two-state switches as "Bool", but that describes the
 * switch, not how the value arrives here - so the lookups are FeatureType.Int,
 * like every other MSFS config in this repo, and the comparisons are loose.
 */
export default class SynapticA220 extends AircraftConfig {
  meta: Meta = {
    id: 'synaptic_a220',
    name: 'Synaptic Simulations A220',
    sim: AircraftConfigSimType.MsFs,
    enabled: true,
    priority: 2,
  }

  features: FeatureAddresses = {
    [AircraftFeature.BeaconLights]: {
      'A22X Beacon Lights': FeatureType.Int,
    },
    [AircraftFeature.NavigationLights]: {
      'A22X Nav Lights': FeatureType.Int,
    },
    [AircraftFeature.StrobeLights]: {
      'A22X Strobe Lights': FeatureType.Int,
    },
    [AircraftFeature.TaxiLights]: {
      'A22X Taxi Lights': FeatureType.Int,
    },
    [AircraftFeature.LandingLights]: {
      'A22X L Landing Lights': FeatureType.Int,
      'A22X R Landing Lights': FeatureType.Int,
      'A22X Nose Landing Lights': FeatureType.Int,
    },
    [AircraftFeature.LogoLights]: {
      'A22X Logo Lights': FeatureType.Int,
    },
    [AircraftFeature.WingLights]: {
      'A22X Wing Insp Lights': FeatureType.Int,
    },
    [AircraftFeature.EmergencyLights]: {
      'A22X Emergency Lights': FeatureType.Int,
    },
    [AircraftFeature.Seatbelts]: {
      'A22X Seat Belt Lights': FeatureType.Int,
    },
    [AircraftFeature.ParkingBrakes]: {
      'A22X Parking Brake': FeatureType.Int,
    },
    [AircraftFeature.Packs]: {
      'A22X L Pack Off': FeatureType.Int,
      'A22X R Pack Off': FeatureType.Int,
    },
    [AircraftFeature.AntiIce]: {
      'A22X L Cowl Anti Ice': FeatureType.Int,
      'A22X R Cowl Anti Ice': FeatureType.Int,
      'A22X Wing Anti Ice': FeatureType.Int,
    },
    [AircraftFeature.APU]: {
      'A22X APU Switch': FeatureType.Int,
    },
    [AircraftFeature.ExternalPower]: {
      INI_GPU_AVAIL: FeatureType.Int,
    },
  }

  flapNames: FlapNames = {
    0: 'UP',
    1: 'CONF 1',
    2: 'CONF 2',
    3: 'CONF 3',
    4: 'FULL',
  }

  match(title: string, icao: string, config_path: string): boolean {
    return ['a220', 'a22x', 'synaptic'].some(
      (w) => title.includes(w) || config_path.includes(w),
    )
  }

  beaconLights(value: number): FeatureState {
    return value == 1
  }

  navigationLights(value: number): FeatureState {
    return value == 1
  }

  strobeLights(value: number): FeatureState {
    return value == 1
  }

  // 0 = Off, 1 = Narrow, 2 = Wide
  taxiLights(value: number): FeatureState {
    return value > 0
  }

  // Three separate switches: left wing, right wing and nose gear
  landingLights(left: number, right: number, nose: number): FeatureState {
    return left == 1 || right == 1 || nose == 1
  }

  logoLights(value: number): FeatureState {
    return value == 1
  }

  wingLights(value: number): FeatureState {
    return value == 1
  }

  // 0 = Off, 1 = Arm, 2 = On
  emergencyLights(value: number): FeatureState {
    return value > 0
  }

  // 0 = Off, 1 = Auto, 2 = On
  seatbelts(value: number): FeatureState {
    return value > 0
  }

  parkingBrakes(value: number): FeatureState {
    return value == 1
  }

  // Vars report the pack switch as *off*, so a pack is on when its flag is 0
  packs(left_off: number, right_off: number): FeatureState {
    return left_off == 0 || right_off == 0
  }

  // Each: 0 = Off, 1 = Auto, 2 = On
  antiIce(left_cowl: number, right_cowl: number, wing: number): FeatureState {
    return wing > 0 || (left_cowl > 0 && right_cowl > 0)
  }

  // 0 = Off, 1 = Run, 2 = Start
  apu(value: number): FeatureState {
    return value >= 1
  }

  externalPower(value: number): FeatureState {
    return value == 1
  }
}
