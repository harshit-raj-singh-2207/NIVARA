import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUser } from '../../hooks/useUser';
import SecureStorage from '../../services/storage/secureStorage';

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { setUser } = useUser();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStorage.getAuthToken();
        // Here we will eventually dispatch an API call to validate the token
        if (token) {
          // navigate to Main
        } else {
          // navigate to Auth
        }
      } catch (e) {
        console.error(e);
      }
    };
    bootstrapAsync();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
