import * as SecureStore from 'expo-secure-store';

/**
 * SecureStorage Utility for NIVARA frontend.
 * Manages JWT tokens, refresh tokens, and encrypted storage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@nivara_access_token';
const REFRESH_TOKEN_KEY = '@nivara_refresh_token';
const USER_KEY = '@nivara_user_data';

export const secureStorage = {
  getAccessToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  setAccessToken: async (token) => {
    if (!token) throw new Error('Cannot store an empty access token');
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (e) {
 * SecureStorage Service
 * 
 * A secure, robust wrapper around expo-secure-store for storing sensitive data
 * like authentication tokens and local user preferences.
 */
class SecureStorage {
  /**
   * Save a string or object securely
   * @param {string} key
   * @param {string|object} value
   */
  static async setItem(key, value) {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      await SecureStore.setItemAsync(key, stringValue);
    } catch (error) {
      console.error(`SecureStorage Error (setItem) for key ${key}:`, error);
    }
  }

  /**
   * Retrieve an item from secure storage
   * @param {string} key
   * @param {boolean} parseJson - whether to attempt parsing the returned string as JSON
   * @returns {any}
   */
  static async getItem(key, parseJson = false) {
    try {
      const result = await SecureStore.getItemAsync(key);
      if (result && parseJson) {
        try {
          return JSON.parse(result);
        } catch {
          return result; // return raw string if json fails
        }
      }
      return result;
    } catch (error) {
      console.error(`SecureStorage Error (getItem) for key ${key}:`, error);
      return null;
    }
  }

  setRefreshToken: async (token) => {
    if (!token) throw new Error('Cannot store an empty refresh token');
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getUserData: async () => {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setUserData: async (user) => {
    if (!user) throw new Error('Cannot store empty user data');
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAll: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  },
};

export default secureStorage;
  /**
   * Delete an item from secure storage
   * @param {string} key
   */
  static async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`SecureStorage Error (removeItem) for key ${key}:`, error);
    }
  }

  // ============================================
  // Convenience Methods
  // ============================================

  static async setAuthToken(token) {
    await this.setItem('AUTH_TOKEN', token);
  }

  static async getAuthToken() {
    return await this.getItem('AUTH_TOKEN');
  }

  static async clearAuthToken() {
    await this.removeItem('AUTH_TOKEN');
  }

  static async clearAllAuthData() {
    await this.removeItem('AUTH_TOKEN');
    await this.removeItem('USER_DATA');
  }
}

export default SecureStorage;
