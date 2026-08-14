import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APP_CONFIG from '../../constants/config';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token from local storage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Storage error fallback
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for data extraction & handling 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('auth_user');
      } catch (e) {
        // Clear storage failure
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
