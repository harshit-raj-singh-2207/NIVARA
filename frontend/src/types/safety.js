/**
 * Safety & GPS Tracking Data Types
 */

export const EMERGENCY_LEVELS = {
  NORMAL: 'NORMAL',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
};

export const createEmergencyContact = (data = {}) => ({
  id: data.id || `cnt_${Date.now()}`,
  name: data.name || '',
  relation: data.relation || 'Parent',
  phone: data.phone || '',
  isPrimary: data.isPrimary || false,
  avatar: data.avatar || null,
});

export const createSafeZone = (data = {}) => ({
  id: data.id || `zone_${Date.now()}`,
  name: data.name || 'Home',
  latitude: data.latitude || 28.6139,
  longitude: data.longitude || 77.2090,
  radiusMeters: data.radiusMeters || 200,
  address: data.address || '',
  isActive: data.isActive ?? true,
});
