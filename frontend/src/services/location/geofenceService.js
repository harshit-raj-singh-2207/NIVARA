/**
 * geofenceService.js
 * Geofence Boundary Detection & Safe Zone Breach Service for NIVARA.
 * Evaluates real-time Haversine distance against configured safe zones and triggers breach alerts.
 */

import useSafetyStore from '../../store/safetyStore';
import safetyApi from '../api/safetyApi';
import { calculateDistanceMeters, isPointInGeofence } from '../../utils/locationUtils';

class GeofenceService {
  constructor() {
    this.lastGeofenceStatus = true; // true = inside, false = breach
  }

  /**
   * Evaluates current GPS location against all active safe zones in safetyStore.
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Object} { isInside: boolean, activeZone: Object | null, minDistance: number }
   */
  evaluateLocation(latitude, longitude) {
    const { safeZones } = useSafetyStore.getState();

    if (!safeZones || safeZones.length === 0) {
      // Default fallback safe zone if list empty
      const defaultZone = {
        id: 'sz_home',
        name: 'Home Safe Haven',
        latitude: 37.7749,
        longitude: -122.4194,
        radiusMeters: 500,
        active: true,
      };
      const isInside = isPointInGeofence(latitude, longitude, defaultZone.latitude, defaultZone.longitude, defaultZone.radiusMeters);
      const dist = calculateDistanceMeters(latitude, longitude, defaultZone.latitude, defaultZone.longitude);
      this.checkBreachState(isInside, defaultZone, latitude, longitude);
      return { isInside, activeZone: isInside ? defaultZone : null, minDistance: dist };
    }

    let isInsideAny = false;
    let currentMatchedZone = null;
    let closestDistance = Infinity;

    for (const zone of safeZones) {
      if (!zone.active) continue;
      const radius = zone.radiusMeters || zone.radius_meters || 500;
      const dist = calculateDistanceMeters(latitude, longitude, zone.latitude, zone.longitude);
      if (dist < closestDistance) closestDistance = dist;

      if (dist <= radius) {
        isInsideAny = true;
        currentMatchedZone = zone;
        break;
      }
    }

    this.checkBreachState(isInsideAny, currentMatchedZone, latitude, longitude);

    return {
      isInside: isInsideAny,
      activeZone: currentMatchedZone,
      minDistance: closestDistance,
    };
  }

  /**
   * Triggers boundary breach events if user transitions from inside to outside safe zones.
   */
  async checkBreachState(isInside, activeZone, latitude, longitude) {
    const wasInside = this.lastGeofenceStatus;
    this.lastGeofenceStatus = isInside;

    // Update store state
    useSafetyStore.setState({
      isInsideSafeZone: isInside,
      activeSafeZone: activeZone,
    });

    if (wasInside && !isInside) {
      console.warn('⚠️ GEOFENCE BREACH DETECTED! User exited safe zone boundary.');

      // Dispatch emergency location update to backend
      try {
        await safetyApi.sendLocationUpdate({
          latitude,
          longitude,
          accuracy: 5.0,
          battery_level: 88,
        });

        await safetyApi.triggerSOSAlert({
          address: 'Geofence Perimeter Breach Location',
          latitude,
          longitude,
          message: 'GEOFENCE BREACH ALERT: User exited registered safe zone perimeter.',
        });
      } catch (err) {
        console.warn('Failed to dispatch geofence breach alert:', err);
      }
    }
  }
}

export const geofenceService = new GeofenceService();
export default geofenceService;
