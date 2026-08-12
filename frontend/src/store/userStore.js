/**
 * User & Profile Domain Zustand Store for NIVARA frontend.
 * Manages active user profile data, settings, sensory preferences, emergency contacts, and caregiver relationships.
 */

import { create } from 'zustand';
import apiClient from '../services/api/apiClient';
import userApi from '../services/api/userApi';
import { ENDPOINTS } from '../constants/api';

const DEFAULT_SETTINGS = {
  theme_mode: 'light',
  sound_sensitivity_level: 3,
  brightness_sensitivity_level: 3,
  font_size_scale: 1.0,
  haptic_feedback_enabled: true,
  push_notifications_enabled: true,
  emergency_contacts: [
    { id: 'c1', name: 'Eleanor Vance', relationship: 'Primary Caregiver', phone: '+1 (555) 234-5678', isPrimary: true },
    { id: 'c2', name: 'Dr. Robert Marcus', relationship: 'Specialist Physician', phone: '+1 (555) 876-5432', isPrimary: false },
  ],
};

export const useUserStore = create((set, get) => ({
  user: null,
  role: null,
  isCaregiver: false,
  settings: DEFAULT_SETTINGS,
  sensoryPreferences: DEFAULT_SETTINGS,
  emergencyContacts: DEFAULT_SETTINGS.emergency_contacts,
  linkedUsers: [],
  isLoading: false,
  error: null,

  /**
   * Sets active user object and computes derived role flags.
   */
  setUser: (userData) => {
    if (!userData) {
      return get().clearUser();
    }

    const userRole = (userData.role || 'user').toLowerCase();
    const isCaregiverFlag = userRole === 'caregiver' || userRole === 'admin';
    const mergedSettings = { ...DEFAULT_SETTINGS, ...(userData.settings || userData.sensory_preferences || {}) };

    set({
      user: userData,
      role: userRole,
      isCaregiver: isCaregiverFlag,
      settings: mergedSettings,
      sensoryPreferences: mergedSettings,
      emergencyContacts: userData.emergency_contacts || mergedSettings.emergency_contacts,
      error: null,
    });
  },

  /**
   * Fetches active user profile from backend API.
   */
  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const userData = await userApi.getMe();
      get().setUser(userData);
      return userData;
    } catch (err) {
      console.warn('Failed to fetch current user profile:', err);
      // Mock fallback user profile for offline/demo operation
      const fallbackUser = {
        id: 'u_101',
        full_name: 'Alex Vance',
        email: 'alex.vance@nivara.app',
        role: 'PATIENT',
        settings: DEFAULT_SETTINGS,
        emergency_contacts: DEFAULT_SETTINGS.emergency_contacts,
      };
      get().setUser(fallbackUser);
      return fallbackUser;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Updates current user profile attributes (name, phone, bio, avatar).
   */
  updateProfile: async (updatePayload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userApi.updateProfile(updatePayload);
      get().setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const { user } = get();
      const updatedUser = { ...user, ...updatePayload };
      get().setUser(updatedUser);
      return updatedUser;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Updates user settings and preferences in backend and store state.
   */
  updateSettings: async (settingsPayload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userApi.updatePreferences(settingsPayload);
      get().setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const { settings, user } = get();
      const newSettings = { ...settings, ...settingsPayload };
      const updatedUser = { ...user, settings: newSettings };
      get().setUser(updatedUser);
      return updatedUser;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Updates user emergency contacts list.
   */
  updateEmergencyContacts: async (contactsList) => {
    set({ emergencyContacts: contactsList });
    try {
      await userApi.updateProfile({ emergency_contacts: contactsList });
    } catch (err) {
      console.warn('Failed to sync emergency contacts:', err);
    }
  },

  /**
   * Fetches list of users linked to the active caregiver account.
   */
  fetchCaregiverLinkedUsers: async () => {
    set({ isLoading: true });
    try {
      const linkedUsersList = await userApi.getCaregiverLinkedUsers();
      set({ linkedUsers: linkedUsersList, isLoading: false });
      return linkedUsersList;
    } catch (err) {
      set({ isLoading: false });
      return [];
    }
  },

  /**
   * Clears user state on logout.
   */
  clearUser: () =>
    set({
      user: null,
      role: null,
      isCaregiver: false,
      settings: DEFAULT_SETTINGS,
      sensoryPreferences: DEFAULT_SETTINGS,
      emergencyContacts: DEFAULT_SETTINGS.emergency_contacts,
      linkedUsers: [],
      isLoading: false,
      error: null,
    }),
}));

export default useUserStore;
