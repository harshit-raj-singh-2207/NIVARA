/**
<<<<<<< HEAD
 * Location and geofencing utility functions.
 * Includes math for distances and point-in-circle checks.
 */

/**
 * Converts degrees to radians.
 * @param {number} deg 
 * @returns {number}
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Calculates the straight-line distance between two geographic coordinates in meters
 * using the Haversine formula.
 * 
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
export const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }

  const R = 6371000; // Radius of the Earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; 
  
  return distance;
};

/**
 * Checks if a given coordinate is inside a circular safe zone.
 * 
 * @param {Object} currentLoc - { latitude, longitude }
 * @param {Object} zone - { latitude, longitude, radius }
 * @returns {boolean} True if inside, false if outside
 */
export const isInsideZone = (currentLoc, zone) => {
  if (!currentLoc || !zone) return false;
  
  const distance = getDistanceMeters(
    currentLoc.latitude,
    currentLoc.longitude,
    zone.latitude,
    zone.longitude
  );
  
  return distance <= zone.radius;
};

/**
 * Checks a coordinate against an array of safe zones and returns the ones it is currently inside.
 * 
 * @param {Object} currentLoc - { latitude, longitude }
 * @param {Array<Object>} zones - Array of safe zone objects
 * @returns {Array<Object>} Array of zones the user is inside
 */
export const getActiveSafeZones = (currentLoc, zones) => {
  if (!currentLoc || !zones || !Array.isArray(zones)) return [];
  
  return zones.filter(zone => zone.active !== false && isInsideZone(currentLoc, zone));
};

/**
 * Formats standard location data from expo-location into our internal LocationRecord format.
 * 
 * @param {Object} expoLocation - Location object returned heavily by expo-location
 * @param {string} source - 'phone' | 'band' | 'manual'
 * @returns {Object} Cleaned LocationRecord
 */
export const formatExpoLocation = (expoLocation, source = 'phone') => {
  if (!expoLocation || !expoLocation.coords) return null;
  
  return {
    latitude: expoLocation.coords.latitude,
    longitude: expoLocation.coords.longitude,
    accuracy: expoLocation.coords.accuracy,
    altitude: expoLocation.coords.altitude,
    heading: expoLocation.coords.heading,
    speed: expoLocation.coords.speed,
    timestamp: new Date(expoLocation.timestamp).toISOString(),
    source
  };
};

/**
 * Formats a raw address string or object into a short UI-friendly string.
 * @param {any} addressObj 
 * @returns {string}
 */
export const formatAddressShort = (addressObj) => {
  if (!addressObj) return 'Unknown Location';
  
  if (typeof addressObj === 'string') {
    // If it's a long string, pick first two segments separated by commas
    const parts = addressObj.split(',');
    if (parts.length > 2) {
      return `${parts[0].trim()}, ${parts[1].trim()}`;
    }
    return addressObj;
  }
  
  // If it's a reverse-geocoded object from expo-location
  if (addressObj.name && addressObj.city) {
    return `${addressObj.name}, ${addressObj.city}`;
  }
  
  if (addressObj.street && addressObj.city) {
    return `${addressObj.street}, ${addressObj.city}`;
  }
  
  return addressObj.city || addressObj.region || 'Unknown Location';
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
};
