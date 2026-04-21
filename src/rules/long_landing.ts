import { PirepState } from '../defs'
import { Meta, Rule, RuleValue } from '../types/rule'
import { Pirep, Telemetry } from '../types/types'

export default class LongLanding implements Rule {
  meta: Meta = {
    id: 'LONG_LANDING',
    name: 'Long landing detection - touchdown zone violation',
    enabled: true,
    message: 'Long landing detected',
    states: [PirepState.Landed],
    repeatable: false,
    cooldown: 60,
    max_count: 1,
    points: -10,
  }

  /**
   * Calculate touchdown zone distance based on runway length
   * Using FAA and ICAO standards
   */
  private calculateTDZDistance(runwayLengthMeters: number): number {
    // ICAO/OACI Standards
    if (runwayLengthMeters >= 2400) {
      return 900 // 900 meters for long runways
    }

    if (runwayLengthMeters >= 1500) {
      return 600 // 600 meters for medium runways
    }

    // Shorter runways - use FAA standard converted to meters (3000 feet ≈ 914 meters)
    return Math.min(914, runwayLengthMeters * 0.5)
  }

  violated(pirep: Pirep, data: Telemetry, previousData?: Telemetry): RuleValue {
    // Get runway information
    if (!pirep.arrivalRunway) {
      return // No runway data available
    }

    const runwayLengthMeters = pirep.arrivalRunway.length.Meters

    // Calculate the distance from threshold where aircraft touched down
    // This would be based on location data - using threshold location and current location
    // For now, we'll use a placeholder approach that would need actual position data
    // In a real implementation, this would calculate distance from threshold using:
    // - thresholdLocation (Coords)
    // - arrivalGate or landing position coordinates

    const touchdownDistanceMeters = pirep.arrivalRunway.distance?.Meters || 0

    // If touchdown distance is 0 or not available, cannot evaluate
    if (touchdownDistanceMeters === 0) {
      return
    }

    // Calculate TDZ for this runway
    const tdzDistance = this.calculateTDZDistance(runwayLengthMeters)
    const midpointDistance = runwayLengthMeters / 2

    // No violation if touchdown is within TDZ
    if (touchdownDistanceMeters <= tdzDistance) {
      return
    }

    // Violation: landed beyond TDZ
    if (touchdownDistanceMeters > midpointDistance) {
      return [
        `Long landing - beyond 50% of runway: ${touchdownDistanceMeters.toFixed(0)}m (runway: ${runwayLengthMeters.toFixed(0)}m)`,
        -10,
      ]
    }

    // Between TDZ and 50% - violation
    return [
      `Long landing - beyond touchdown zone: ${touchdownDistanceMeters.toFixed(0)}m (TDZ: ${tdzDistance.toFixed(0)}m)`,
      -10,
    ]
  }
}
