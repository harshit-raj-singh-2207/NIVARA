import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorage = {
  setObject: async (key, obj) => AsyncStorage.setItem(key, JSON.stringify(obj)),
  getObject: async (key) => {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  },
  clear: async () => AsyncStorage.clear(),
};

export default localStorage;
