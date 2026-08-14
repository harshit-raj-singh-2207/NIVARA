export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PREFERENCES: '/users/preferences',
  },
  COMMUNICATION: {
    AAC_GRID: '/communication/aac-grid',
    EMOTION_LOG: '/communication/emotions',
    SPEECH_SYNTHESIS: '/communication/tts',
  },
  LEARNING: {
    ROUTINES: '/learning/routines',
    TASKS: '/learning/tasks',
    TUTOR_CHAT: '/learning/tutor/chat',
  },
  SENSORY: {
    ENVIRONMENT_DATA: '/sensory/environment',
    PREFERENCES: '/sensory/preferences',
  },
  SAFETY: {
    EMERGENCY_TRIGGER: '/safety/emergency/trigger',
    SAFE_ZONES: '/safety/safe-zones',
    LOCATION_UPDATE: '/safety/location',
  },
  CAREGIVER: {
    CHILDREN_STATUS: '/caregiver/children',
    ALERTS: '/caregiver/alerts',
  },
  COMMUNITY: {
    POSTS: '/community/posts',
    GROUPS: '/community/groups',
    CHATS: '/community/chats',
  }
};

export default API_ENDPOINTS;
