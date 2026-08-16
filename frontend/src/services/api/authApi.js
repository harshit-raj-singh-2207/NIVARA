import apiClient from './apiClient';

/**
 * API Wrapper for Authentication endpoints
 */
export const authApi = {
  /**
   * Log a user in
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    // Note: Once backend is built, this is the real call:
    // const response = await apiClient.post('/auth/login', { email, password });
    // return response.data;
    
    // MOCK IMPLEMENTATION FOR NOW
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Email and password required'));
          return;
        }
        if (password === 'wrong') {
          reject(new Error('Invalid credentials'));
          return;
        }
        resolve({
          token: 'mock-jwt-token-12345',
          user: {
            id: 'u_123',
            name: email.split('@')[0],
            email,
            // Mock role to 'safety' for demonstration, typically this comes from DB
            role: email.includes('care') ? 'caregiver' : 'safety'
          }
        });
      }, 1000);
    });
  },

  /**
   * Register a new user
   * @param {Object} data 
   * @param {string} data.name
   * @param {string} data.email
   * @param {string} data.password
   */
  register: async ({ name, email, password }) => {
    // const response = await apiClient.post('/auth/register', { name, email, password });
    // return response.data;

    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-new',
          user: {
            id: 'u_new',
            name,
            email,
            role: null // Unassigned initially, awaits RoleSelectionScreen
          }
        });
      }, 1000);
    });
  }
};
