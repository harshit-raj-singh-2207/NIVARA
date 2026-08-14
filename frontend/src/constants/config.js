export const APP_CONFIG = {
  appName: 'NIVARA',
  version: '1.0.0',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  wsBaseUrl: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  defaultLanguage: 'en',
  supportEmail: 'support@nivara.org',
  maxSafeZoneRadiusMeters: 5000,
  minSafeZoneRadiusMeters: 50,
};

export default APP_CONFIG;
