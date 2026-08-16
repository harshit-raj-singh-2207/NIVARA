import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

/**
 * Universal hook to execute API calls while automatically managing
 * local `loading` and `error` states, catching exceptions safely.
 * 
 * Usage:
 * const { data, loading, error, execute } = useApi(userApi.getMe);
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Optional: tap into the global app loader if a request is critical
  const setGlobalLoading = useAppStore((state) => state.setLoading);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      // setGlobalLoading(true); // Enable if you want this API call to block the whole UI
      
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      // Basic extraction of the error message from Axios
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      // setGlobalLoading(false);
    }
  }, [apiFunction, setGlobalLoading]);

  return { data, error, loading, execute };
};
