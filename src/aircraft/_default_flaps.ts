import { FlapNames } from '../interface/aircraft'

/**
 * See if the title, icao or config_path match with what the simulator
 * is saying. All of the values are passed in already lower-cased.
 * Return true or false
 *
 * The ICAO and config_path may not be available in some sims.
 *
 * @param title The title of the aircraft
 * @param icao The ICAO of the aircraft. Might not be available
 * @param config_path Path to the aircraft config. Might not be there
 */
export default function GetDefaultFlaps(
  title: string,
  icao: string,
  config_path: string,
): FlapNames {
  if (/^B712/i.test(icao)) {
    return {
      0: 'UP',
      1: '0',
      2: 'DIAL TO',
      3: '11',
      4: '15',
      5: '28',
      6: '40',
    }
  }

  if (/^B73./i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '2',
      3: '5',
      4: '10',
      5: '15',
      6: '25',
      7: '30',
      8: '40',
    }
  }

  if (/^B74./i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '5',
      3: '10',
      4: '20',
      5: '25',
      6: '30',
    }
  }

  if (/^B75./i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '5',
      3: '15',
      4: '20',
      5: '25',
      6: '30',
    }
  }

  if (/^B76./i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '5',
      3: '15',
      4: '20',
      5: '25',
      6: '30',
    }
  }

  if (/^B77./i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '5',
      3: '15',
      4: '20',
      5: '25',
      6: '30',
    }
  }

  if (/^B78./i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '5',
      3: '10',
      4: '15',
      5: '17',
      6: '19',
      7: '20',
      8: '25',
      9: '30',
    }
  }

  if (/^B72./i.test(icao)) {
    return {
      0: 'UP',
      1: '2',
      2: '5',
      3: '15',
      4: '20',
      5: '25',
      6: '30',
      7: '40',
    }
  }

  if (/^B3.M/i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '2',
      3: '5',
      4: '10',
      5: '15',
      6: '25',
      7: '30',
      8: '40',
    }
  }

  // Airbus Group
  if (/^A30./i.test(icao)) {
    return {
      0: 'UP',
      1: '15/0',
      2: '15/15',
      3: '15/20',
      4: '30/40',
    }
  }

  if (/^A3ST./i.test(icao)) {
    return {
      0: 'UP',
      1: '15/0',
      2: '15/15',
      3: '15/20',
      4: '30/40',
    }
  }

  if (/^A310/i.test(icao)) {
    return {
      0: 'UP',
      1: '15/0',
      2: '15/15',
      3: '20/20',
      4: '30/40',
    }
  }

  if (/^A318/i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A319/i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A32./i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A33./i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A34./i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A35./i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A38./i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A19N/i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A20N/i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^A21N/i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  if (/^BCS/i.test(icao)) {
    return {
      0: 'UP',
      1: 'CONF 1',
      2: 'CONF 2',
      3: 'CONF 3',
      4: 'FULL',
    }
  }

  // McDonnell Douglas Group
  if (/^MD11/i.test(icao)) {
    return {
      0: 'UP',
      1: '0',
      2: 'DIAL TO',
      3: '28',
      4: '35',
      5: '50',
    }
  }

  if (/^MD8/i.test(icao)) {
    return {
      0: 'UP',
      1: '0',
      2: 'DIAL TO',
      3: '11',
      4: '15',
      5: '28',
      6: '40',
    }
  }

  if (/^MD90/i.test(icao)) {
    return {
      0: 'UP',
      1: '0',
      2: 'DIAL TO',
      3: '11',
      4: '15',
      5: '28',
      6: '40',
    }
  }

  // Canadair Regional Jet(CRJ) Group
  if (/^CRJ/i.test(icao)) {
    return {
      0: 'UP',
      1: '1',
      2: '8',
      3: '20',
      4: '30',
      5: '45',
    }
  }

  // Cessna Group
  if (/^C172/i.test(icao)) {
    return {
      0: 'UP',
      1: '10',
      2: '20',
      3: 'FULL',
    }
  }

  if (/^C182/i.test(icao)) {
    return {
      0: 'UP',
      1: '10',
      2: '20',
      3: 'FULL',
    }
  }

  if (/^C82R/i.test(icao)) {
    return {
      0: 'UP',
      1: '10',
      2: '20',
      3: 'FULL',
    }
  }

  return {}
}
