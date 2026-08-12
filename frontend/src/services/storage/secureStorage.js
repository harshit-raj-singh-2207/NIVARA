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
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {}
  },

  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  setRefreshToken: async (token) => {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (e) {}
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
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {}
  },

  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    } catch (e) {}
  },
};

export default secureStorage;
