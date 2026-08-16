import { create } from 'zustand';

/**
 * Global User Store
 * In-memory Zustand store for managing the active authenticated session.
 * 
 * Note: We do NOT use AsyncStorage persist middleware here, because sensitive 
 * user data should primarily be kept in memory or fetched hot on launch using 
 * the encrypted tokens in SecureStorage.
 */
export const useUserStore = create((set, get) => ({
  user: null,      // Full user object from API
  role: null,      // 'user' (autistic individual) or 'caregiver'
  isAuthenticated: false,

  /**
   * Inject full user data from API into global state
   */
  setUser: (userData) => {
    set({
      user: userData,
      role: userData?.role || null,
      isAuthenticated: !!userData
    });
  },

  /**
   * Clear the active session (Call this on Logout)
   */
  clearUser: () => {
    set({
      user: null,
      role: null,
      isAuthenticated: false
    });
  },
  
  /**
   * Update nested specific preferences in the store instantly
   */
  updateUserPreferences: (newPreferences) => {
    const currentData = get().user;
    if (currentData) {
        set({ 
          user: { 
            ...currentData, 
            preferences: { 
              ...currentData.preferences, 
              ...newPreferences 
            } 
          } 
        });
    }
  }
}));
