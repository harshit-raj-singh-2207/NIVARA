import { create } from 'zustand';
import userApi from '../services/api/userApi';

export const useUserStore = create((set, get) => ({
  profile: {
    id: 'usr_001',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    bio: 'Empowered student & visual AAC user on CareMate AI',
    preferredLanguage: 'English (US)',
    communicationPreference: 'Icons', // 'Voice', 'Text', 'Icons', 'Pictures'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    caregiverConnection: {
      guardianName: 'Priya Sharma',
      guardianEmail: 'priya.caregiver@example.com',
      guardianPhone: '+91 98765 00000',
      status: 'VERIFIED', // 'PENDING', 'VERIFIED', 'FAILED', 'EXPIRED'
      lastActive: '2 mins ago',
    },
    preferences: {
      darkMode: false,
      soundEffects: true,
      hapticFeedback: true,
      fontSize: 'medium',
      highContrast: false,
      textToSpeechVoice: 'en-US-Standard-A',
      ttsSpeed: 1.0,
      autoReadAAC: true,
      emergencyNotifications: true,
      caregiverNotifications: true,
      routineNotifications: true,
      generalNotifications: false,
    },
  },
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await userApi.getProfile();
      set(state => ({
        profile: { ...state.profile, ...data },
        isLoading: false,
      }));
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  updateProfile: (updates) => {
    set(state => ({
      profile: { ...state.profile, ...updates }
    }));
  },

  updatePreferences: (newPrefs) => {
    set(state => ({
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, ...newPrefs }
      }
    }));
  },

  updateCaregiverConnection: (connectionInfo) => {
    set(state => ({
      profile: {
        ...state.profile,
        caregiverConnection: { ...state.profile.caregiverConnection, ...connectionInfo }
      }
    }));
  }
}));

export default useUserStore;
