/**
 * Custom React Hook: useAuth
 * Connects UI components to useAuthStore & useUserStore for user authentication, session state, and RBAC role metadata.
 */

import { useCallback } from 'react';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';

export const useAuth = () => {
  const {
    user: authUser,
    isAuthenticated,
    isLoading: authLoading,
    isInitialized,
    error: authError,
    login,
    register,
    logout,
    updateUserRole,
    clearError: clearAuthError,
  } = useAuthStore();

  const { user: userProfile, isCaregiver, role, updateProfile, updateSettings } = useUserStore();

  const currentUser = userProfile || authUser;
  const activeRole = role || currentUser?.role || 'user';
  const isCaregiverAccount = isCaregiver || activeRole.toLowerCase() === 'caregiver' || activeRole.toLowerCase() === 'admin';

  const handleLogin = useCallback(
    async (credentials, password) => {
      const loggedUser = await login(credentials, password);
      return loggedUser;
    },
    [login]
  );

  const handleRegister = useCallback(
    async (userData) => {
      const newMember = await register(userData);
      return newMember;
    },
    [register]
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    user: currentUser,
    isAuthenticated,
    isLoading: authLoading,
    isInitialized,
    isCaregiver: isCaregiverAccount,
    role: activeRole,
    error: authError,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUserRole,
    updateProfile,
    updateSettings,
    clearError: clearAuthError,
  };
};

export default useAuth;
