/**
 * authStore.js
 * Authentication Zustand Store for NIVARA frontend.
 * Manages authentication state, user session persistence via secureStorage, and user role management.
 */

import { create } from 'zustand';
import secureStorage from '../services/storage/secureStorage';
import authApi from '../services/api/authApi';
import { resetAndNavigate } from '../navigation/navigationRef';
import { registerSessionExpiredHandler } from '../services/auth/sessionEvents';

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
  restoreSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await secureStorage.getAccessToken();
      const storedUser = await secureStorage.getUserData();

      if (token && storedUser) {
        const verifiedUser = await authApi.getCurrentUser();
        set({
          user: verifiedUser || storedUser,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return true;
      } else {
        if (token || storedUser) await secureStorage.clearAll();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return false;
      }
    } catch (err) {
      console.warn('Session restoration failed:', err);
      await get().logout();
    } finally {
      set({ isHydrating: false });
    }
  },

  /**
   * Alias helper for session initialization on startup.
   */
  initializeAuth: async () => {
    return await get().restoreSession();
  },

  /**
   * Executes login via authApi, stores tokens in secureStorage, and updates user state.
   * @param {Object|string} credentials - { email, password } or email string
   * @param {string} [passwordStr] - Optional password if parameters passed separately
   */
  login: async (credentials, passwordStr) => {
    set({ isLoading: true, error: null });
    try {
      const loginPayload =
        typeof credentials === 'object'
          ? credentials
          : { email: credentials, password: passwordStr };

      const response = await authApi.login(loginPayload);

      const { access_token, refresh_token, user } = response;

      if (access_token) {
        await secureStorage.setAccessToken(access_token);
      }
      if (refresh_token) {
        await secureStorage.setRefreshToken(refresh_token);
      }

      if (!access_token || !user) throw new Error('The server returned an incomplete login response.');
      const userProfile = user;

      await secureStorage.setUserData(userProfile);
      const persistedToken = await secureStorage.getAccessToken();
      if (persistedToken !== access_token) throw new Error('Your session could not be saved. Please try again.');

      set({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return userProfile;
    } catch (err) {
      const errMsg = err?.message || 'Login failed. Please verify credentials.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  /**
   * Registers a new account via authApi and updates store state.
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(userData);

      const { access_token, refresh_token, user } = response;
      if (access_token) await secureStorage.setAccessToken(access_token);
      if (refresh_token) await secureStorage.setRefreshToken(refresh_token);

      await secureStorage.setUserData(user);
      const persistedToken = await secureStorage.getAccessToken();
      if (persistedToken !== access_token) throw new Error('Your session could not be saved. Please try again.');

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return user;
    } catch (err) {
      const errMsg = err?.message || 'Registration failed.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  /**
   * Clears stored tokens and user session data, resetting store state and navigating to LoginScreen.
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

export default useAuthStore;

registerSessionExpiredHandler(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: true,
    error: 'Your session has expired. Please sign in again.',
  });
});
