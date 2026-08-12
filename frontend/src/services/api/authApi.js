/**
 * Authentication API Service functions for NIVARA frontend.
 */

import apiClient from './apiClient';
import { ENDPOINTS } from '../../constants/api';

export const authApi = {
  register: (data) => apiClient.post(ENDPOINTS.REGISTER, data),
  login: (credentials) => apiClient.post(ENDPOINTS.LOGIN, credentials),
  refreshToken: (refreshToken) => apiClient.post(ENDPOINTS.REFRESH_TOKEN, { refresh_token: refreshToken }),
  verifyCaregiverCode: (code) => apiClient.post(ENDPOINTS.VERIFY_CAREGIVER, { caregiver_code: code }),
  submitCaregiverVerification: (data) => apiClient.post(ENDPOINTS.VERIFY_CAREGIVER, data),
};

export default authApi;

