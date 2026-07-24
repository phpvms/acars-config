import { AircraftConfigSimType, AircraftFeature, FeatureType } from '../defs'
import {
    AircraftConfig,
    FeatureAddresses,
    FeatureState,
    FlapNames,
    Meta,
} from '../interface/aircraft'

export default class FlyByWireA380X extends AircraftConfig {
    meta: Meta = {
        id: 'flybywire_a380x',
        name: 'FlyByWire A380X',
        sim: AircraftConfigSimType.MsFs,
        enabled: true,
        priority: 2,
        author: 'Arthur Parienté <https://github.com/arthurpar06>'
    }

    features: FeatureAddresses = {
        [AircraftFeature.BeaconLights]: {
            LIGHTING_BEACON_0: FeatureType.Int,
        },
        [AircraftFeature.LandingLights]: {
            LIGHTING_LANDING_2: FeatureType.Int,
        },
        [AircraftFeature.LogoLights]: {
            // Lhe logo light isn't available in the FBW A380X at the moment; in the sim, the navigation light currently controls the logo ligh
            LIGHTING_NAV_0: FeatureType.Int,
        },
        [AircraftFeature.NavigationLights]: {
            LIGHTING_NAV_0: FeatureType.Int,
        },
        [AircraftFeature.StrobeLights]: {
            LIGHTING_STROBE_0: FeatureType.Int,
        },
        [AircraftFeature.TaxiLights]: {
            LIGHTING_LANDING_1: FeatureType.Int,
        },
        [AircraftFeature.WingLights]: {
            LIGHTING_WING_0: FeatureType.Int,
        },
        [AircraftFeature.APU]: {
            A32NX_OVHD_APU_MASTER_SW_PB_IS_ON: FeatureType.Int,
            A32NX_OVHD_APU_START_SW_PB_IS_ON: FeatureType.Int,
        },
        [AircraftFeature.Battery]: {
            A32NX_OVHD_ELEC_BAT_1_PB_IS_AUTO: FeatureType.Int,
            A32NX_OVHD_ELEC_BAT_2_PB_IS_AUTO: FeatureType.Int,
            A32NX_OVHD_ELEC_BAT_ESS_PB_IS_AUTO: FeatureType.Int,
        },
        [AircraftFeature.Seatbelts]: {
            XMLVAR_SWITCH_OVHD_INTLT_SEATBELT_Position: FeatureType.Int,
        },
        [AircraftFeature.EmergencyLights]: {
            XMLVAR_SWITCH_OVHD_INTLT_EMEREXIT_Position: FeatureType.Int,
        },
        [AircraftFeature.AntiIce]: {
            XMLVAR_Momentary_PUSH_OVHD_ANTIICE_ENG1_Pressed: FeatureType.Int,
            XMLVAR_Momentary_PUSH_OVHD_ANTIICE_ENG2_Pressed: FeatureType.Int,
            XMLVAR_Momentary_PUSH_OVHD_ANTIICE_ENG3_Pressed: FeatureType.Int,
            XMLVAR_Momentary_PUSH_OVHD_ANTIICE_ENG4_Pressed: FeatureType.Int,
            XMLVAR_Momentary_PUSH_OVHD_ANTIICE_WING_Pressed: FeatureType.Int,
        }
    }

    flapNames: FlapNames = {
        0: 'UP',
        1: 'CONF 1',
        2: 'CONF 1+F',
        3: 'CONF 2',
        4: 'CONF 3',
        5: 'FULL',
    }

    match(title: string, icao: string, config_path: string): boolean {
        if (!title.includes('a380')) {
            return false;
        }

        return ['fbw', 'flybywire'].some((w) => title.includes(w));
    }

    beaconLights(value: number): FeatureState {
        return value === 1;
    }

    landingLights(value: number): FeatureState {
        return value === 1;
    }

    logoLights(value: number): FeatureState {
        return value === 1;
    }

    navigationLights(value: number): FeatureState {
        return value === 1;
    }

    strobeLights(value: number): FeatureState {
        if (value === 1) {
            return null;
        }
        return value === 0;
    }

    wingLights(value: number): FeatureState {
        return value === 1;
    }

    taxiLights(value: number): FeatureState {
        return value === 0 || value === 1;
    }

    apu(mastersw: number, startsw: number): FeatureState {
        return mastersw === 1 && startsw === 1;
    }

    battery(bat1: number, bat2: number, ess: number): FeatureState {
        // Since each battery is worth one when on, we can simply add them and check the sum. We need at least two batteries to be on.
        return bat1 + bat2 + ess >= 2;
    }

    emergencyLights(value: number): FeatureState {
        return value !== 2;
    }

    seatbelts(value: number): FeatureState {
        return value !== 2;
    }

    antiIce(eng1: number, eng2: number, eng3: number, eng4: number, wing: number): FeatureState {
        return eng1 === 1 || eng2 === 1 || eng3 === 1 || eng4 === 1 || wing === 1;
    }
}
