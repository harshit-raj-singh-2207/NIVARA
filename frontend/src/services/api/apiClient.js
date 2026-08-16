import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../../constants/config';
import * as SecureStore from 'expo-secure-store';

/**
 * Key used to store the JWT auth token securely.
 * Note: Auth logic itself belongs to Part 4, but we need
 * the interceptor here so Part 2 features can authenticate.
 */
const AUTH_TOKEN_KEY = 'NIVARA_AUTH_TOKEN';

/**
 * Creates and configures the singleton Axios instance used for all network requests.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * Injects the Authorization header if a token is present.
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Optional logging for dev mode
      if (__DEV__) {
        console.log(`[API Req] ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    } catch (error) {
      // SecureStore read failure
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Can handle global 401s (token expiry) to trigger logout via Zustand later.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Note: Logging 401s here. 
    // Actual logout redirection will be wired via the authStore (Part 4)
    // when it mounts and sets up an interceptor hook.
    if (error.response && error.response.status === 401) {
      if (__DEV__) {
        console.warn('[API 401] Unauthorized. Token may be expired.');
      }
      // Depending on architecture, you might dispatch an event or call authStore.logout() here
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to manually set token on login without waiting for next storage read
 * (Used by Part 4 Auth module)
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;
