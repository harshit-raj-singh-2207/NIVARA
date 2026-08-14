import apiClient from './apiClient';
import API_ENDPOINTS from '../../constants/api';

export const authApi = {
  login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (data) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data),
  verifyCaregiver: (data) => apiClient.post('/auth/verify-caregiver', data),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  getMe: () => apiClient.get(API_ENDPOINTS.AUTH.ME),
};

export default authApi;
