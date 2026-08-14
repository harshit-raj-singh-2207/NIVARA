import apiClient from './apiClient';
import API_ENDPOINTS from '../../constants/api';

export const communicationApi = {
  getAACGrid: () => apiClient.get(API_ENDPOINTS.COMMUNICATION.AAC_GRID),
  logEmotion: (data) => apiClient.post(API_ENDPOINTS.COMMUNICATION.EMOTION_LOG, data),
};

export default communicationApi;
