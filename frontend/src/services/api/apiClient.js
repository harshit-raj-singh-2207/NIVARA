/**
 * Axios HTTP API Client for NIVARA frontend.
 * Handles REST API calls, automatic JWT Bearer token header injection, 401 automatic token refresh interceptors, and navigation resets.
 */

import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, ENDPOINTS } from '../../constants/api';
import secureStorage from '../storage/secureStorage';
import { resetAndNavigate } from '../../navigation/navigationRef';
import { parseApiError } from '../../utils/errorHandler';
import { notifySessionExpired } from '../auth/sessionEvents';

// Base Axios instance configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
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

const isPublicAuthRequest = (url = '') =>
  url.includes(ENDPOINTS.LOGIN) ||
  url.includes(ENDPOINTS.REGISTER) ||
  url.includes(ENDPOINTS.REFRESH_TOKEN);

const isAuthenticationFailure = (error) => {
  const status = error.response?.status;
  const message = String(error.response?.data?.message || error.response?.data?.detail || '').toLowerCase();
  return status === 401 || (status === 403 && message.includes('not authenticated'));
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
    if (isAuthenticationFailure(error) && originalRequest && !originalRequest._retry) {
      // Don't loop on auth endpoints
      if (
        isPublicAuthRequest(originalRequest.url)
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
        notifySessionExpired();
        resetAndNavigate('LoginScreen');

        return Promise.reject(parseApiError(refreshErr));
      }
    }

    return Promise.reject(parseApiError(error));
  }
);

export default apiClient;
