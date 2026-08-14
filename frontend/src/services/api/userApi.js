import apiClient from './apiClient';
import API_ENDPOINTS from '../../constants/api';

export const userApi = {
  getProfile: () => apiClient.get(API_ENDPOINTS.USER.PROFILE),
  updateProfile: (profileData) => apiClient.put(API_ENDPOINTS.USER.PROFILE, profileData),
  getPreferences: () => apiClient.get(API_ENDPOINTS.USER.UPDATE_PREFERENCES),
  updatePreferences: (prefs) => apiClient.put(API_ENDPOINTS.USER.UPDATE_PREFERENCES, prefs),
};

export default userApi;
