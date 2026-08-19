import apiClient from './apiClient';
import { ENDPOINTS } from '../../constants/api';

/**
 * Safety Domain API requests (Part 2).
 * Handles emergencies, location updates, geofences, and GPS bands.
 */

export const safetyApi = {
  // ── Emergency / SOS ─────────────────────────────────────
  
  /**
   * Triggers a new emergency SOS event.
   * @param {Object} payload 
   * @param {import('../../types/safety').EmergencyType} payload.type
   * @param {import('../../types/safety').LocationCoords} payload.location
   * @returns {Promise<import('../../types/safety').EmergencyEvent>}
   */
  createEmergency: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.EMERGENCY.CREATE, payload);
    return response.data;
  },

  /**
   * Checks if there's currently an active emergency for the user.
   * @returns {Promise<import('../../types/safety').EmergencyEvent | null>}
   */
  getActiveEmergency: async () => {
    const response = await apiClient.get(ENDPOINTS.SAFETY.EMERGENCY.ACTIVE);
    return response.data;
  },

  /**
   * Marks an active emergency as resolved (safe state achieved).
   * @param {string} id 
   * @returns {Promise<import('../../types/safety').EmergencyEvent>}
   */
  resolveEmergency: async (id) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.EMERGENCY.RESOLVE(id));
    return response.data;
  },

  /**
   * Cancels a false-alarm emergency.
   * @param {string} id 
   * @returns {Promise<import('../../types/safety').EmergencyEvent>}
   */
  cancelEmergency: async (id) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.EMERGENCY.CANCEL(id));
    return response.data;
  },

  // ── Locations ───────────────────────────────────────────

  /**
   * Pushes a batch of location updates from background tracking to the server.
   * @param {import('../../types/safety').LocationRecord[]} locations 
   * @returns {Promise<{success: boolean, eventsTriggered?: number}>}
   */
  syncLocations: async (locations) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.LOCATION.UPDATE, { locations });
    return response.data;
  },

  // ── Safe Zones (Geofences) ──────────────────────────────

  /**
   * Gets all safe zones defined for the current user.
   * @returns {Promise<import('../../types/safety').SafeZone[]>}
   */
  getSafeZones: async () => {
    const response = await apiClient.get(ENDPOINTS.SAFETY.SAFE_ZONES.LIST);
    return response.data;
  },

  /**
   * Creates a new safe zone.
   * @param {Omit<import('../../types/safety').SafeZone, 'id' | 'createdAt' | 'updatedAt'>} zoneData 
   * @returns {Promise<import('../../types/safety').SafeZone>}
   */
  createSafeZone: async (zoneData) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.SAFE_ZONES.CREATE, zoneData);
    return response.data;
  },

  /**
   * Deletes a safe zone by ID.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  deleteSafeZone: async (id) => {
    await apiClient.delete(ENDPOINTS.SAFETY.SAFE_ZONES.DELETE(id));
  },

  // ── GPS Band / Wearable ─────────────────────────────────

  /**
   * Gets the paired GPS band (if any) for the user.
   * @returns {Promise<import('../../types/safety').GPSBand[]>}
   */
  getBands: async () => {
    const response = await apiClient.get(ENDPOINTS.SAFETY.BANDS.LIST);
    return response.data;
  },

  /**
   * Registers a new GPS band.
   * @param {Object} bandData 
   * @returns {Promise<import('../../types/safety').GPSBand>}
   */
  registerBand: async (bandData) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.BANDS.REGISTER, bandData);
    return response.data;
  },

  /**
   * Updates band status (e.g., battery dropped, connection lost).
   * @param {string} id 
   * @param {Partial<import('../../types/safety').GPSBand>} updates 
   * @returns {Promise<import('../../types/safety').GPSBand>}
   */
  updateBandStatus: async (id, updates) => {
    const response = await apiClient.patch(ENDPOINTS.SAFETY.BANDS.UPDATE_STATUS(id), updates);
    return response.data;
  },

  // ── Emergency Contacts ──────────────────────────────────

  /**
   * Fetches user's emergency contacts in priority order.
   * @returns {Promise<import('../../types/safety').EmergencyContact[]>}
   */
  getContacts: async () => {
    const response = await apiClient.get(ENDPOINTS.SAFETY.CONTACTS.LIST);
    return response.data;
  },

  /**
   * Adds a new emergency contact.
   * @param {Omit<import('../../types/safety').EmergencyContact, 'id'>} contact 
   * @returns {Promise<import('../../types/safety').EmergencyContact>}
   */
  createContact: async (contact) => {
    const response = await apiClient.post(ENDPOINTS.SAFETY.CONTACTS.CREATE, contact);
    return response.data;
  },

  /**
   * Deletes an emergency contact.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  deleteContact: async (id) => {
    await apiClient.delete(ENDPOINTS.SAFETY.CONTACTS.DELETE(id));
  },

  // ── Safety Events ───────────────────────────────────────

  /**
   * Fetches the safety event timeline for the user.
   * @param {Object} options 
   * @param {number} [options.limit=20]
   * @param {number} [options.offset=0]
   * @returns {Promise<import('../../types/safety').SafetyEvent[]>}
   */
  getEvents: async (options = { limit: 20, offset: 0 }) => {
    const response = await apiClient.get(ENDPOINTS.SAFETY.EVENTS.LIST, { params: options });
    return response.data;
  },
};
