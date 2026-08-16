import * as SecureStore from 'expo-secure-store';

/**
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
