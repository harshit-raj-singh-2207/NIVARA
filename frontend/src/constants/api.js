/**
 * API Endpoints & Config for NIVARA frontend.
 */

import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }
  return 'http://localhost:8000/api/v1';
};

const getWsUrl = () => {
  if (process.env.EXPO_PUBLIC_WS_URL) {
    return process.env.EXPO_PUBLIC_WS_URL;
  }
  if (Platform.OS === 'android') {
    return 'ws://10.0.2.2:8000/ws';
  }
  return 'ws://localhost:8000/ws';
};

export const API_BASE_URL = getBaseUrl();
export const WS_URL = getWsUrl();
export const API_TIMEOUT = 15000;

export const ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_CAREGIVER: '/auth/verify-caregiver',

  // Users
  GET_ME: '/users/me',
  UPDATE_PROFILE: '/users/me',
  UPDATE_SETTINGS: '/users/me/settings',
  UPDATE_PREFERENCES: '/users/me/preferences',
  CAREGIVER_LINKED_USERS: '/users/caregiver-linked-users',
};

export default {
  API_BASE_URL,
  WS_URL,
  API_TIMEOUT,
  ENDPOINTS,
};
