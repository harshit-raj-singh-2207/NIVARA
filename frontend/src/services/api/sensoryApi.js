import apiClient from './apiClient';

export const sensoryApi = {
  getEnvironment: () => apiClient.get('/sensory/environment'),
  updatePreferences: (prefs) => apiClient.put('/sensory/preferences', prefs),
};

export default sensoryApi;
