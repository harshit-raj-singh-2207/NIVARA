/**
 * NIVARA Application Navigation Route Constants.
 */

export const AUTH_ROUTES = {
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  CAREGIVER_VERIFICATION: 'CaregiverVerification',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
};

export const MAIN_ROUTES = {
  HOME_TAB: 'HomeTab',
  COMMUNITY_TAB: 'CommunityTab',
  PROFILE_TAB: 'ProfileTab',
};

export const HOME_ROUTES = {
  HOME: 'HomeScreen',
  NOTIFICATIONS: 'NotificationsScreen',
  COMMUNICATION: 'CommunicationFlow',
  LEARNING: 'LearningFlow',
};

export const COMMUNICATION_ROUTES = {
  HOME: 'CommunicationScreen', AAC: 'AACScreen', EMOTION: 'EmotionScreen',
  QUICK: 'QuickCommunicationScreen', HISTORY: 'CommunicationHistoryScreen',
};

export const LEARNING_ROUTES = {
  HOME: 'LearningHomeScreen', ROUTINES: 'RoutineScreen', ROUTINE_DETAILS: 'RoutineDetailsScreen',
  TASK_DETAILS: 'TaskDetailsScreen', TOPICS: 'LearningTopicsScreen', TUTOR: 'TutorScreen', REMINDERS: 'RemindersScreen',
};

export const PROFILE_ROUTES = {
  PROFILE: 'ProfileScreen',
  EDIT_PROFILE: 'EditProfileScreen',
  SETTINGS: 'SettingsScreen',
  PRIVACY: 'PrivacyScreen',
  NOTIFICATION_SETTINGS: 'NotificationSettingsScreen',
  ABOUT: 'AboutScreen',
};

export const COMMUNITY_ROUTES = {
  COMMUNITY_FEED: 'CommunityFeedScreen',
  CREATE_POST: 'CreatePostScreen',
};

export default {
  AUTH_ROUTES,
  MAIN_ROUTES,
  HOME_ROUTES,
  COMMUNICATION_ROUTES,
  LEARNING_ROUTES,
  PROFILE_ROUTES,
  COMMUNITY_ROUTES,
};
