import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import useAuthStore from '../../store/authStore';

export const SplashScreen = ({ navigation }) => {
  const { restoreSession, isAuthenticated, isOnboarded, isRestoringSession } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const initializeApp = async () => {
      await restoreSession();
      // Brief branding display timer
      setTimeout(() => {
        if (!isMounted) return;
        if (isAuthenticated) {
          // Parent stack listener handles redirect or navigation can replace
        } else if (!isOnboarded) {
          navigation.replace('Onboarding');
        } else {
          navigation.replace('Login');
        }
      }, 1500);
    };

    initializeApp();
    return () => { isMounted = false; };
  }, []);

  return (
    <SafeAreaWrapper className="bg-[#5B8DEF] items-center justify-center">
      <View className="items-center px-6 text-center">
        {/* App Logo */}
        <View className="w-24 h-24 rounded-3xl bg-white/20 items-center justify-center mb-6 border border-white/30 shadow-lg">
          <Ionicons name="heart-half" size={52} color="#FFFFFF" />
        </View>

        {/* App Name & Tagline */}
        <Text className="text-4xl font-black text-white tracking-tight mb-2">
          CareMate AI
        </Text>
        <Text className="text-base font-semibold text-blue-100 text-center max-w-xs leading-relaxed mb-10">
          Personalized support when it matters.
        </Text>

        {/* Minimal Loading Indicator */}
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;
