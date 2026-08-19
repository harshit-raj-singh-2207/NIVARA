import { useUserStore } from '../store/userStore';

/**
 * Custom hook to easily access and manipulate the current authenticated user's state
 * from anywhere in the React component tree.
 */
export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.role);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const updateUserPreferences = useUserStore((state) => state.updateUserPreferences);
  
  // Convenience boolean flags for quick role-based UI rendering
  const isCaregiver = role === 'caregiver';
  const isAutisticUser = role === 'user';
  
  return {
    user,
    role,
    isAuthenticated,
    isCaregiver,
    isAutisticUser,
    setUser,
    clearUser,
    updateUserPreferences
  };
};
