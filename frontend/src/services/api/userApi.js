import apiClient from './apiClient';

/**
 * userApi
 * Service class for securely fetching and updating authenticated user profiles
 * from the backend server.
 */
export const userApi = {
  /**
   * Fetch the current authenticated user's profile data
   * @returns {Promise<Object>} user record from database
   */
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Update the current user's profile information
   * @param {Object} updateData - Partial user data payload (e.g. { name: 'Alex' })
   * @returns {Promise<Object>} updated user record
   */
  updateMe: async (updateData) => {
    const response = await apiClient.patch('/users/me', updateData);
    return response.data;
  },

  /**
   * Fetch user-specific preferences (e.g. sensory configurations, accessibility flags)
   * @returns {Promise<Object>} preferences object
   */
  getPreferences: async () => {
    const response = await apiClient.get('/users/me/preferences');
    return response.data;
  },

  /**
   * Update user preferences
   * @param {Object} preferencesData 
   * @returns {Promise<Object>} updated preferences object
   */
  updatePreferences: async (preferencesData) => {
    const response = await apiClient.patch('/users/me/preferences', preferencesData);
    return response.data;
  },

  /**
   * Delete or deactivate the user account permanently
   * @returns {Promise<Object>} confirmation message
   */
  deleteAccount: async () => {
    const response = await apiClient.delete('/users/me');
    return response.data;
  },
  
  /**
   * Used for Caregivers to fetch authorized dependent/ward profiles
   * @param {string} childId 
   * @returns {Promise<Object>}
   */
  getDependentProfile: async (childId) => {
    const response = await apiClient.get(`/users/dependent/${childId}`);
    return response.data;
  }
};
