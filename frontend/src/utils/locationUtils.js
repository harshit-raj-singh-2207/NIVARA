/**
 * Location Utilities for NIVARA frontend.
 * Provides Haversine distance calculations, geofence boundary checks, and address formatting.
 */

/**
 * Calculates Haversine distance in meters between two lat/lng points.
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Checks if point (lat, lng) is within radius_meters of center (centerLat, centerLng).
 */
export const isPointInGeofence = (lat, lng, centerLat, centerLng, radiusMeters = 500) => {
  const distance = calculateDistanceMeters(lat, lng, centerLat, centerLng);
  return distance <= radiusMeters;
};

/**
 * Formats coordinates into readable string.
 */
export const formatCoordinates = (lat, lng) => {
  if (lat == null || lng == null) return 'Unknown GPS Location';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
};

export default {
  calculateDistanceMeters,
  isPointInGeofence,
  formatCoordinates,
};
