import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class CenterlineDeviation implements Rule {
  meta: Meta = {
    id: 'CENTERLINE_DEVIATION',
    name: 'Centerline deviation detection',
    enabled: true,
    message: 'Centerline deviation detected',
    states: [PirepState.Landed],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -10,
  }

  /**
   * Calculate perpendicular distance from point to line
   * Uses haversine formula for lat/lon to meters conversion
   */
  private calculateLateralDeviation(
    aircraftLat: number,
    aircraftLon: number,
    runwayLat: number,
    runwayLon: number,
    nextRunwayLat: number,
    nextRunwayLon: number,
  ): number {
    const R = 6371000 // Earth radius in meters

    // Convert degrees to radians
    const lat1 = (aircraftLat * Math.PI) / 180
    const lon1 = (aircraftLon * Math.PI) / 180
    const lat2 = (runwayLat * Math.PI) / 180
    const lon2 = (runwayLon * Math.PI) / 180
    const lat3 = (nextRunwayLat * Math.PI) / 180
    const lon3 = (nextRunwayLon * Math.PI) / 180

    // Calculate distance from point to line using cross track error formula
    const dLat = lat3 - lat2
    const dLon = lon3 - lon2
    const y = Math.sin(lon1 - lon2) * Math.cos(lat1)
    const x =
      Math.cos(lat2) * Math.sin(lat3) -
      Math.sin(lat2) * Math.cos(lat3) * Math.cos(lon3 - lon2)

    const bearing = Math.atan2(y, x)
    const dLat12 = lat2 - lat1
    const dLon12 = lon2 - lon1

    const distance = Math.asin(
      Math.sin(
        Math.sqrt(dLat12 * dLat12 + dLon12 * dLon12 * Math.cos((lat2 + lat1) / 2) * Math.cos((lat2 + lat1) / 2)),
      ) *
        Math.sin(bearing),
    ) * R

    return Math.abs(distance)
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Only check during landed state with runway data
    if (!data.runway) {
      return
    }

    const runway = data.runway
    const aircraftLocation = data.location
    const runwayCenter = runway.runwayCenter
    const runwayWidth = runway.width.Meters
    const runwayStart = runway.startLocation
    const runwayEnd = runway.endLocation

    // Calculate lateral deviation from centerline
    const lateralDeviation = this.calculateLateralDeviation(
      aircraftLocation.lat,
      aircraftLocation.lon,
      runwayStart.lat,
      runwayStart.lon,
      runwayEnd.lat,
      runwayEnd.lon,
    )

    const halfRunwayWidth = runwayWidth / 2

    // Skid off - deviation exceeds runway width
    if (lateralDeviation > halfRunwayWidth) {
      return [
        `Skid off runway - deviation: ${lateralDeviation.toFixed(1)}m (runway width: ${runwayWidth.toFixed(1)}m)`,
        -100,
      ]
    }

    // Centerline deviation > 10 meters
    if (lateralDeviation > 10) {
      return [
        `Centerline deviation: ${lateralDeviation.toFixed(1)}m (limit: 10m)`,
        -10,
      ]
    }

    return
  }
}
