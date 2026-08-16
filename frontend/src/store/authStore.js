import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'nivara_jwt_token';
const USER_ROLE_KEY = 'nivara_user_role';
const USER_PROFILE_KEY = 'nivara_user_profile';

/**
 * Zustand Store for Authentication
 * Handles secure storage of the JWT and user profile over app restarts.
 */
export const useAuthStore = create((set, get) => ({
  user: null,         // Object containing profile and { role: 'caregiver' | 'safety' }
  token: null,        // JWT for API requests
  isHydrating: true,  // True while loading from SecureStore on app launch
  isLoading: false,   // True during login/register API calls
  error: null,

  /**
   * Called during App Bootstrap (e.g. by a hook or RootNavigator).
   * Reads SecureStore to re-authenticate the user without them logging in again.
   */
  hydrate: async () => {
    try {
      set({ isHydrating: true, error: null });
      const [token, role, profileStr] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_ROLE_KEY),
        SecureStore.getItemAsync(USER_PROFILE_KEY)
      ]);

      if (token && role && profileStr) {
        set({ 
          token, 
          user: { ...JSON.parse(profileStr), role } 
        });
      }
    } catch (error) {
      console.warn('Auth Rehydration Failed:', error);
      // Failsafe: clear potentially corrupted storage
      await get().logout();
    } finally {
      set({ isHydrating: false });
    }
  },

  /**
   * Action to save successful login data
   */
  setSession: async (token, userProfile) => {
    try {
      set({ isLoading: true });
      
      // Save securely to device
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token),
        SecureStore.setItemAsync(USER_ROLE_KEY, userProfile.role),
        SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(userProfile))
      ]);

      set({ token, user: userProfile, error: null });
    } catch (error) {
      console.error('Failed to securely save session:', error);
      set({ error: 'Failed to securely save session. Check device storage.' });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Action to completely clear session and log out
   */
  logout: async () => {
    try {
      set({ isLoading: true });
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_ROLE_KEY),
        SecureStore.deleteItemAsync(USER_PROFILE_KEY)
      ]);
      set({ token: null, user: null, error: null });
    } catch (ignore) {
      // Best effort cleanup
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
