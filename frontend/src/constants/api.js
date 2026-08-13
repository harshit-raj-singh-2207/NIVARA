/**
 * API endpoint path constants.
 * All backend routes referenced from a single place to prevent typos.
 *
 * Usage:  apiClient.get(ENDPOINTS.SAFETY.EMERGENCY.LIST)
 */

import { API_VERSION } from './config';

const BASE = `/api/${API_VERSION}`;

// ── Auth (Part 4) ───────────────────────────────────────
export const AUTH = {
  LOGIN: `${BASE}/auth/login`,
  REGISTER: `${BASE}/auth/register`,
  REFRESH: `${BASE}/auth/refresh`,
  LOGOUT: `${BASE}/auth/logout`,
  FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE}/auth/reset-password`,
  VERIFY_CAREGIVER: `${BASE}/auth/verify-caregiver`,
};

// ── Users (Part 4) ──────────────────────────────────────
export const USERS = {
  PROFILE: `${BASE}/users/profile`,
  UPDATE: `${BASE}/users/profile`,
  SETTINGS: `${BASE}/users/settings`,
};

// ── Safety (Part 2) ─────────────────────────────────────
export const SAFETY = {
  // Emergency / SOS
  EMERGENCY: {
    CREATE: `${BASE}/safety/emergency`,
    LIST: `${BASE}/safety/emergency`,
    GET: (id) => `${BASE}/safety/emergency/${id}`,
    RESOLVE: (id) => `${BASE}/safety/emergency/${id}/resolve`,
    CANCEL: (id) => `${BASE}/safety/emergency/${id}/cancel`,
    ACTIVE: `${BASE}/safety/emergency/active`,
  },

  // Location
  LOCATION: {
    UPDATE: `${BASE}/safety/locations`,
    CURRENT: (userId) => `${BASE}/safety/locations/${userId}/current`,
    HISTORY: (userId) => `${BASE}/safety/locations/${userId}/history`,
    SHARE: `${BASE}/safety/locations/share`,
  },

  // Safe Zones / Geofencing
  SAFE_ZONES: {
    LIST: `${BASE}/safety/safe-zones`,
    CREATE: `${BASE}/safety/safe-zones`,
    GET: (id) => `${BASE}/safety/safe-zones/${id}`,
    UPDATE: (id) => `${BASE}/safety/safe-zones/${id}`,
    DELETE: (id) => `${BASE}/safety/safe-zones/${id}`,
    CHECK: `${BASE}/safety/safe-zones/check`,
  },

  // GPS Band / Wearable
  BANDS: {
    LIST: `${BASE}/safety/bands`,
    REGISTER: `${BASE}/safety/bands`,
    GET: (id) => `${BASE}/safety/bands/${id}`,
    UPDATE_STATUS: (id) => `${BASE}/safety/bands/${id}/status`,
    UNREGISTER: (id) => `${BASE}/safety/bands/${id}`,
  },

  // Safety Events
  EVENTS: {
    LIST: `${BASE}/safety/events`,
    GET: (id) => `${BASE}/safety/events/${id}`,
    CREATE: `${BASE}/safety/events`,
  },

  // Emergency Contacts
  CONTACTS: {
    LIST: `${BASE}/safety/contacts`,
    CREATE: `${BASE}/safety/contacts`,
    GET: (id) => `${BASE}/safety/contacts/${id}`,
    UPDATE: (id) => `${BASE}/safety/contacts/${id}`,
    DELETE: (id) => `${BASE}/safety/contacts/${id}`,
    REORDER: `${BASE}/safety/contacts/reorder`,
  },
};

// ── Caregiver (Part 2) ──────────────────────────────────
export const CAREGIVER = {
  DASHBOARD: `${BASE}/caregivers/dashboard`,
  CHILDREN: {
    LIST: `${BASE}/caregivers/children`,
    GET: (id) => `${BASE}/caregivers/children/${id}`,
    STATUS: (id) => `${BASE}/caregivers/children/${id}/status`,
    SAFETY: (id) => `${BASE}/caregivers/children/${id}/safety`,
    DEVICES: (id) => `${BASE}/caregivers/children/${id}/devices`,
  },
  PREFERENCES: `${BASE}/caregivers/preferences`,
};

// ── Notifications (shared) ──────────────────────────────
export const NOTIFICATIONS = {
  LIST: `${BASE}/notifications`,
  MARK_READ: (id) => `${BASE}/notifications/${id}/read`,
  MARK_ALL_READ: `${BASE}/notifications/read-all`,
  SETTINGS: `${BASE}/notifications/settings`,
  REGISTER_PUSH: `${BASE}/notifications/push-token`,
};

// ── Community (Part 3) ──────────────────────────────────
export const COMMUNITY = {
  POSTS: {
    LIST: `${BASE}/community/posts`,
    CREATE: `${BASE}/community/posts`,
    GET: (id) => `${BASE}/community/posts/${id}`,
    DELETE: (id) => `${BASE}/community/posts/${id}`,
    COMMENTS: (id) => `${BASE}/community/posts/${id}/comments`,
  },
  GROUPS: {
    LIST: `${BASE}/community/groups`,
    CREATE: `${BASE}/community/groups`,
    GET: (id) => `${BASE}/community/groups/${id}`,
    JOIN: (id) => `${BASE}/community/groups/${id}/join`,
    LEAVE: (id) => `${BASE}/community/groups/${id}/leave`,
    MEMBERS: (id) => `${BASE}/community/groups/${id}/members`,
  },
  CHAT: {
    LIST: `${BASE}/community/chats`,
    CREATE: `${BASE}/community/chats`,
    MESSAGES: (id) => `${BASE}/community/chats/${id}/messages`,
  },
};

// ── Communication (Part 1) ──────────────────────────────
export const COMMUNICATION = {
  AAC: `${BASE}/communication/aac`,
  SPEECH: `${BASE}/communication/speech`,
  EMOTIONS: `${BASE}/communication/emotions`,
  HISTORY: `${BASE}/communication/history`,
};

// ── Learning (Part 1) ───────────────────────────────────
export const LEARNING = {
  ROUTINES: {
    LIST: `${BASE}/learning/routines`,
    GET: (id) => `${BASE}/learning/routines/${id}`,
  },
  TASKS: {
    LIST: `${BASE}/learning/tasks`,
    GET: (id) => `${BASE}/learning/tasks/${id}`,
  },
  TOPICS: `${BASE}/learning/topics`,
  TUTOR: `${BASE}/learning/tutor`,
  REMINDERS: `${BASE}/learning/reminders`,
};

// ── Aggregated export ───────────────────────────────────
export const ENDPOINTS = {
  AUTH,
  USERS,
  SAFETY,
  CAREGIVER,
  NOTIFICATIONS,
  COMMUNITY,
  COMMUNICATION,
  LEARNING,
};
