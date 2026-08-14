import apiClient from './apiClient';
import API_ENDPOINTS from '../../constants/api';

export const learningApi = {
  getRoutines: () => apiClient.get(API_ENDPOINTS.LEARNING.ROUTINES),
  sendTutorMessage: (message) => apiClient.post(API_ENDPOINTS.LEARNING.TUTOR_CHAT, { message }),
};

export default learningApi;
