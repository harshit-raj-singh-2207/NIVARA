/**
 * Navigation route name constants.
 * Use these instead of raw strings to prevent typos in navigation.navigate() calls.
 *
 * Usage:  navigation.navigate(ROUTES.SAFETY.EMERGENCY)
 */

// ── Root / Tab Navigators ───────────────────────────────
export const ROOT = {
  AUTH: 'AuthStack',
  MAIN: 'MainStack',
};

export const TABS = {
  HOME: 'HomeTab',
  SAFETY: 'SafetyTab',
  COMMUNICATION: 'CommunicationTab',
  COMMUNITY: 'CommunityTab',
  CAREGIVER: 'CaregiverTab',
  PROFILE: 'ProfileTab',
};

// ── Auth Screens (Part 4) ───────────────────────────────
export const AUTH = {
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  CAREGIVER_VERIFICATION: 'CaregiverVerification',
};

// ── Home Screens (Part 4) ───────────────────────────────
export const HOME = {
  DASHBOARD: 'HomeDashboard',
  NOTIFICATIONS: 'Notifications',
};

// ── Safety Screens (Part 2) ─────────────────────────────
export const SAFETY = {
  HOME: 'SafetyHome',
  EMERGENCY: 'Emergency',
  LIVE_LOCATION: 'LiveLocation',
  SAFE_ZONES: 'SafeZones',
  ADD_SAFE_ZONE: 'AddSafeZone',
  GPS_BAND: 'GPSBand',
  EMERGENCY_CONTACTS: 'EmergencyContacts',
  EVENT_DETAILS: 'SafetyEventDetails',
};

// ── Caregiver Screens (Part 2) ──────────────────────────
export const CAREGIVER = {
  DASHBOARD: 'CaregiverDashboard',
  CHILD_PROFILE: 'ChildProfile',
  CHILD_STATUS: 'ChildStatus',
  DEVICE_STATUS: 'DeviceStatus',
  SAFETY_OVERVIEW: 'SafetyOverview',
  CONTACTS: 'CaregiverContacts',
  PREFERENCES: 'CaregiverPreferences',
  ROUTINE_OVERVIEW: 'RoutineOverview',
};

// ── Communication Screens (Part 1) ──────────────────────
export const COMMUNICATION = {
  HOME: 'CommunicationHome',
  AAC: 'AAC',
  EMOTION: 'Emotion',
  QUICK: 'QuickCommunication',
  HISTORY: 'CommunicationHistory',
};

// ── Learning Screens (Part 1) ───────────────────────────
export const LEARNING = {
  HOME: 'LearningHome',
  TOPICS: 'LearningTopics',
  ROUTINE: 'Routine',
  ROUTINE_DETAILS: 'RoutineDetails',
  TASK_DETAILS: 'TaskDetails',
  TUTOR: 'Tutor',
  REMINDERS: 'Reminders',
};

// ── Community Screens (Part 3) ──────────────────────────
export const COMMUNITY = {
  HOME: 'CommunityHome',
  FEED: 'CommunityFeed',
  CREATE_POST: 'CreatePost',
  POST_DETAILS: 'PostDetails',
  CHAT_LIST: 'ChatList',
  DIRECT_MESSAGE: 'DirectMessage',
  NEW_CHAT: 'NewChat',
  GROUPS: 'Groups',
  CREATE_GROUP: 'CreateGroup',
  GROUP_CHAT: 'GroupChat',
  GROUP_DETAILS: 'GroupDetails',
  GROUP_MEMBERS: 'GroupMembers',
  DISCOVER_GROUPS: 'DiscoverGroups',
  CAREGIVER_PROFILE: 'CaregiverProfile',
};

// ── Profile Screens (Part 4) ────────────────────────────
export const PROFILE = {
  HOME: 'ProfileHome',
  EDIT: 'EditProfile',
  SETTINGS: 'Settings',
  NOTIFICATION_SETTINGS: 'NotificationSettings',
  PRIVACY: 'Privacy',
  ABOUT: 'About',
};

// ── Sensory Screens (Part 4) ────────────────────────────
export const SENSORY = {
  HOME: 'SensoryHome',
  ENVIRONMENT: 'Environment',
  PREFERENCES: 'SensoryPreferences',
  SOCIAL_CUE: 'SocialCue',
};

// ── Aggregated export ───────────────────────────────────
export const ROUTES = {
  ROOT,
  TABS,
  AUTH,
  HOME,
  SAFETY,
  CAREGIVER,
  COMMUNICATION,
  LEARNING,
  COMMUNITY,
  PROFILE,
  SENSORY,
};
