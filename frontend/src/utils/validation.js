import { GEOFENCE_CONFIG } from '../constants/config';

/**
 * Common validation utilities for forms and data input.
 * Returns { isValid: boolean, error?: string } for strict checks, 
 * or just a boolean for simple checks.
 */

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a phone number (basic international/local fallback).
 * Allows +, spaces, dashes, parentheses. Must have 7-15 digits.
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

/**
 * Validates an emergency contact payload.
 * @param {Object} contact 
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateEmergencyContact = (contact) => {
  if (!contact.name || contact.name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (!isValidPhone(contact.phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  if (!contact.relationship || contact.relationship.trim().length === 0) {
    return { isValid: false, error: 'Relationship is required' };
  }

  return { isValid: true };
};

/**
 * Validates a safe zone payload before creation/update.
 * @param {Object} zone 
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateSafeZone = (zone) => {
  if (!zone.name || zone.name.trim().length === 0) {
    return { isValid: false, error: 'Zone name is required' };
  }
  
  if (zone.radius < GEOFENCE_CONFIG.minRadius) {
    return { isValid: false, error: `Radius must be at least ${GEOFENCE_CONFIG.minRadius}m` };
  }

  if (zone.radius > GEOFENCE_CONFIG.maxRadius) {
    return { isValid: false, error: `Radius cannot exceed ${(GEOFENCE_CONFIG.maxRadius / 1000).toFixed(1)}km` };
  }

  if (!isValidCoordinate(zone.latitude, zone.longitude)) {
    return { isValid: false, error: 'Invalid map coordinates selected' };
  }

  return { isValid: true };
};

/**
 * Checks if latitude and longitude are within valid Earth ranges.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export const isValidCoordinate = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  
  // Guard against standard dummy values like 0,0 being accidentally submitted without user intent
  if (lat === 0 && lng === 0) return false;

  return true;
};
