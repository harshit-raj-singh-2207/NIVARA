import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api/authApi';

/**
 * React Hook for Authentication.
 * Connects the UI to the Zustand store and Auth API.
 */
export const useAuth = () => {
  const { 
    user, 
    token, 
    isHydrating, 
    isLoading, 
    error,
    hydrate, 
    setSession, 
    logout: clearSession,
    setError,
    setLoading
  } = useAuthStore();

  // Try to load any existing token on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi.login(email, password);
      await setSession(data.token, data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession, setError, setLoading]);

  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi.register({ name, email, password });
      await setSession(data.token, data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession, setError, setLoading]);

  const logout = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  /**
   * Sets the user role after registration (during onboarding)
   * e.g., 'caregiver' or 'safety'
   */
  const setRole = useCallback(async (role) => {
    if (!user) return false;
    try {
      setLoading(true);
      // Example: await authApi.updateProfile({ role });
      
      const updatedUser = { ...user, role };
      // Save it securely
      await setSession(token, updatedUser);
      return true;
    } catch (err) {
      setError('Failed to set role');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, token, setSession, setError, setLoading]);

  return {
    user,
    token,
    isHydrating,
    isLoading,
    error,
    login,
    register,
    logout,
    setRole,
  };
};
