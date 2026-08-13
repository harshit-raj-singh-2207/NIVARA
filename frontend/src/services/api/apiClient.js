<<<<<<< HEAD
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
=======
/**
 * Axios HTTP API Client for NIVARA frontend.
 * Handles REST API calls, automatic JWT Bearer token header injection, 401 automatic token refresh interceptors, and navigation resets.
 */

import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, ENDPOINTS } from '../../constants/api';
import secureStorage from '../storage/secureStorage';
import { resetAndNavigate } from '../../navigation/navigationRef';
import { parseApiError } from '../../utils/errorHandler';

// Base Axios instance configuration
export const apiClient = axios.create({
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
<<<<<<< HEAD
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

=======
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Retrieve JWT accessToken from secureStorage and inject into Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to retrieve access token from storage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Intercept 401 errors, queue concurrent requests, and handle automatic token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      const parsedError = parseApiError(error);
      return Promise.reject(parsedError);
    }

    // Handle 401 Unauthorized token expiration
    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      // Don't loop on auth endpoints
      if (
        originalRequest.url.includes(ENDPOINTS.LOGIN) ||
        originalRequest.url.includes(ENDPOINTS.REFRESH_TOKEN)
      ) {
        return Promise.reject(parseApiError(error));
      }

      // If token refresh is already in progress, queue failed request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(parseApiError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = await secureStorage.getRefreshToken();

        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        // Call backend refresh endpoint directly
        const refreshResponse = await axios.post(`${API_BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`, {
          refresh_token: storedRefreshToken,
        });

        const { access_token, refresh_token: new_refresh_token } = refreshResponse.data;

        // Save updated tokens to secureStorage
        await secureStorage.setAccessToken(access_token);
        if (new_refresh_token) {
          await secureStorage.setRefreshToken(new_refresh_token);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Clear secure storage and reset navigation to LoginScreen
        await secureStorage.clearAll();
        resetAndNavigate('LoginScreen');

        return Promise.reject(parseApiError(refreshErr));
      }
    }

    return Promise.reject(parseApiError(error));
  }
);

>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
export default apiClient;
