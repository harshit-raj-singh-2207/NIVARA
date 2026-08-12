/**
 * NIVARA Core App & API Configuration Constants.
 */

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@nivara_access_token',
  REFRESH_TOKEN: '@nivara_refresh_token',
  USER_DATA: '@nivara_user_data',
  THEME_MODE: '@nivara_theme_mode',
  FONT_SCALE: '@nivara_font_scale',
};

export const APP_METADATA = {
  NAME: 'NIVARA',
  TAGLINE: 'AI-Powered Communication, Learning & Safety Ecosystem',
  VERSION: '1.0.0',
};

export default {
  API_CONFIG,
  STORAGE_KEYS,
  APP_METADATA,
};
