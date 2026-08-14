import apiClient from './apiClient';

export const caregiverApi = {
  getChildrenStatus: () => apiClient.get('/caregiver/children'),
  getAlerts: () => apiClient.get('/caregiver/alerts'),
};

export default caregiverApi;
