/**
 * User & Profile API Service functions for NIVARA frontend.
 */

import apiClient from './apiClient';
import { ENDPOINTS } from '../../constants/api';

export const userApi = {
  getMe: () => apiClient.get(ENDPOINTS.GET_ME),
  updateProfile: (data) => apiClient.patch(ENDPOINTS.UPDATE_PROFILE, data),
  updatePreferences: (preferences) => apiClient.patch(ENDPOINTS.UPDATE_PREFERENCES, preferences),
  getCaregiverLinkedUsers: () => apiClient.get(ENDPOINTS.CAREGIVER_LINKED_USERS),
  updatePushToken: (token) => apiClient.patch(ENDPOINTS.UPDATE_PROFILE, { push_token: token }),
};

export default userApi;
