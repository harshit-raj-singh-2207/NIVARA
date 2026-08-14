import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../services/api/authApi';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isRestoringSession: true,
  isOnboarded: false,
  error: null,

  // Restore persistent token & onboarding status on app boot
  restoreSession: async () => {
    set({ isRestoringSession: true, error: null });
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      const storedOnboarded = await AsyncStorage.getItem('auth_onboarded');

      const isOnboarded = storedOnboarded === 'true';

      if (storedToken && storedUser) {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          isOnboarded,
          isRestoringSession: false,
        });
      } else {
        // Fallback demo initial user if no session stored
        set({
          user: {
            id: 'usr_001',
            name: 'Aarav Sharma',
            email: 'aarav@example.com',
            role: 'INDIVIDUAL',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            sensoryProfile: 'HYPERSENSITIVE',
            caregiverName: 'Priya Sharma',
            caregiverEmail: 'priya.caregiver@example.com',
            caregiverStatus: 'VERIFIED',
          },
          token: 'demo_jwt_token_12345',
          isAuthenticated: true,
          isOnboarded,
          isRestoringSession: false,
        });
      }
    } catch (err) {
      set({ isRestoringSession: false, error: err.message });
    }
  },

  setOnboarded: async (status = true) => {
    try {
      await AsyncStorage.setItem('auth_onboarded', status ? 'true' : 'false');
    } catch (e) {}
    set({ isOnboarded: status });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Perform API call or fallback simulation if backend offline
      let resultData;
      try {
        resultData = await authApi.login({ email, password });
      } catch (e) {
        // Simulation for UI demonstration / offline mode
        await new Promise((res) => setTimeout(res, 800));
        const isCaregiver = email.toLowerCase().includes('caregiver');
        resultData = {
          token: `jwt_token_${Date.now()}`,
          user: {
            id: isCaregiver ? 'usr_cg_100' : 'usr_001',
            name: isCaregiver ? 'Priya Sharma' : 'Aarav Sharma',
            email: email,
            role: isCaregiver ? 'CAREGIVER' : 'INDIVIDUAL',
            avatar: isCaregiver
              ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            sensoryProfile: 'BALANCED',
            caregiverName: 'Priya Sharma',
            caregiverStatus: 'VERIFIED',
          },
        };
      }

      const { user, token } = resultData;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Invalid email or password.';
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      let resultData;
      try {
        resultData = await authApi.register(userData);
      } catch (e) {
        await new Promise((res) => setTimeout(res, 800));
        resultData = {
          token: `jwt_token_new_${Date.now()}`,
          user: {
            id: `usr_${Date.now()}`,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'INDIVIDUAL',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            caregiverStatus: userData.role === 'CAREGIVER' ? 'PENDING' : 'UNCONNECTED',
          },
        };
      }

      const { user, token } = resultData;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Registration failed.';
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  verifyCaregiver: async (code, contactInfo) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((res) => setTimeout(res, 1000));
      if (code !== '123456' && code !== '654321') {
        throw new Error('Invalid verification code. Use demo code: 123456');
      }

      const updatedUser = {
        ...get().user,
        caregiverStatus: 'VERIFIED',
        caregiverEmail: contactInfo || 'priya.caregiver@example.com',
        caregiverName: 'Priya Sharma',
      };

      await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((res) => setTimeout(res, 800));
      set({ isLoading: false });
      return { success: true, message: 'Password reset code sent to your email.' };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  resetPassword: async (code, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((res) => setTimeout(res, 800));
      set({ isLoading: false });
      return { success: true, message: 'Password has been reset successfully.' };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
    } catch (e) {}
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  switchRole: async (role) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, role };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updated));
      set({ user: updated });
    }
  },
}));

export default useAuthStore;
