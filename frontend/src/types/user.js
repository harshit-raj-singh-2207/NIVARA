/**
 * User data types and validation definitions
 */

export const USER_ROLES = {
  INDIVIDUAL: 'INDIVIDUAL',
  CAREGIVER: 'CAREGIVER',
  THERAPIST: 'THERAPIST',
  ADMIN: 'ADMIN',
};

export const SENSORY_PROFILES = {
  HYPERSENSITIVE: 'HYPERSENSITIVE',
  HYPOSENSITIVE: 'HYPOSENSITIVE',
  BALANCED: 'BALANCED',
  SEEKING: 'SEEKING',
};

export const createUserProfile = (data = {}) => ({
  id: data.id || `usr_${Date.now()}`,
  name: data.name || 'User',
  email: data.email || '',
  role: data.role || USER_ROLES.INDIVIDUAL,
  avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: data.bio || '',
  phone: data.phone || '',
  sensoryProfile: data.sensoryProfile || SENSORY_PROFILES.BALANCED,
  preferences: {
    darkMode: data.preferences?.darkMode ?? false,
    soundEffects: data.preferences?.soundEffects ?? true,
    hapticFeedback: data.preferences?.hapticFeedback ?? true,
    fontSize: data.preferences?.fontSize || 'medium',
    highContrast: data.preferences?.highContrast ?? false,
    textToSpeechVoice: data.preferences?.textToSpeechVoice || 'natural-en-US',
  },
  caregiverId: data.caregiverId || null,
  linkedChildren: data.linkedChildren || [],
  createdAt: data.createdAt || new Date().toISOString(),
});
