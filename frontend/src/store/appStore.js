import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Global App Store
 * Manages non-sensitive, global application state such as UI themes,
 * onboarding completion status, and global visual loading blockers.
 */
export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'system', // 'light', 'dark', or 'system'
      isFirstLaunch: true,
      isLoading: false,

      setTheme: (theme) => set({ theme }),
      
      completeOnboarding: () => set({ isFirstLaunch: false }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      resetApp: () => set({ theme: 'system', isFirstLaunch: true, isLoading: false })
    }),
    {
      name: 'nivara-app-storage',
      // Store app configs in AsyncStorage (no sensitive data here)
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist theme and isFirstLaunch, don't crash app if isLoading was true on exit
      partialize: (state) => ({ 
        theme: state.theme, 
        isFirstLaunch: state.isFirstLaunch 
      })
    }
  )
);
