import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureStorage = {
  setItem: async (key, value) => AsyncStorage.setItem(key, value),
  getItem: async (key) => AsyncStorage.getItem(key),
  removeItem: async (key) => AsyncStorage.removeItem(key),
};

export default secureStorage;
