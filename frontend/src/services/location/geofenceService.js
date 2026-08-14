import { calculateDistanceMeters } from '../../utils/locationUtils';

export const geofenceService = {
  checkGeofenceBoundary: (currentLoc, safeZone) => {
    const dist = calculateDistanceMeters(
      currentLoc.latitude,
      currentLoc.longitude,
      safeZone.latitude,
      safeZone.longitude
    );
    return {
      inside: dist <= safeZone.radiusMeters,
      distanceMeters: dist,
    };
  }
};

export default geofenceService;
