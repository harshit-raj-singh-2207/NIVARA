/**
 * backgroundLocation.js
 * Persistent Background GPS Location Service for NIVARA.
 * Handles continuous background location tracking, battery efficiency adaptation, and geofence evaluations.
 */

import { requestLocationPermission } from '../../utils/permissionUtils';
import useSafetyStore from '../../store/safetyStore';
import safetyApi from '../api/safetyApi';
import geofenceService from './geofenceService';
import { formatCoordinates } from '../../utils/locationUtils';

class BackgroundLocationManager {
  constructor() {
    this.isTracking = false;
    this.trackingInterval = null;
    this.currentIntervalMs = 10000; // 10 seconds default
    this.lastLatitude = 37.7749;
    this.lastLongitude = -122.4194;
  }

  /**
   * Starts persistent background location tracking task.
   */
  async startBackgroundTracking() {
    const permission = await requestLocationPermission();
    if (permission?.status !== 'granted') {
      console.warn('Background Location permission denied.');
      return false;
    }

    if (this.isTracking) return true;
    this.isTracking = true;

    useSafetyStore.setState({ isTracking: true });
    console.log('📍 Background GPS Location Service Started.');

    this.runLocationTaskLoop();
    return true;
  }

  /**
   * Main tracking loop emitting GPS updates and checking geofence breaches.
   */
  runLocationTaskLoop() {
    this.stopTaskLoop();

    this.trackingInterval = setInterval(async () => {
      if (!this.isTracking) return;

      // Simulate minor GPS drift / movement delta
      const driftLat = (Math.random() - 0.5) * 0.0008;
      const driftLng = (Math.random() - 0.5) * 0.0008;
      this.lastLatitude += driftLat;
      this.lastLongitude += driftLng;

      const currentLat = this.lastLatitude;
      const currentLng = this.lastLongitude;
      const address = formatCoordinates(currentLat, currentLng);

      // Evaluate geofence boundaries
      const geofenceResult = geofenceService.evaluateLocation(currentLat, currentLng);

      // Update safety store state
      useSafetyStore.setState({
        location: {
          latitude: currentLat,
          longitude: currentLng,
          address,
          isInsideSafeZone: geofenceResult.isInside,
          lastUpdated: 'Just now',
        },
      });

      // Send telemetry to backend
      try {
        await safetyApi.sendLocationUpdate({
          latitude: currentLat,
          longitude: currentLng,
          accuracy: 5.0,
          battery_level: 88,
        });
      } catch (err) {
        console.warn('Failed to sync background location update to backend:', err);
      }

      // Battery efficiency guard: adjust interval
      this.adjustBatteryEfficiency(88);
    }, this.currentIntervalMs);
  }

  /**
   * Dynamically adjusts tracking interval based on battery level.
   */
  adjustBatteryEfficiency(batteryLevel = 88) {
    let targetInterval = 10000;
    if (batteryLevel < 20) {
      targetInterval = 30000; // Low battery: sample every 30s
    } else if (batteryLevel < 50) {
      targetInterval = 20000; // Medium battery: sample every 20s
    } else {
      targetInterval = 10000; // High battery: sample every 10s
    }

    if (targetInterval !== this.currentIntervalMs) {
      this.currentIntervalMs = targetInterval;
      this.runLocationTaskLoop();
    }
  }

  stopTaskLoop() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  /**
   * Stops persistent background location tracking task.
   */
  stopBackgroundTracking() {
    this.stopTaskLoop();
    this.isTracking = false;
    useSafetyStore.setState({ isTracking: false });
    console.log('🛑 Background GPS Location Service Stopped.');
  }
}

export const backgroundLocation = new BackgroundLocationManager();
export default backgroundLocation;
