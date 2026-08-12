/**
 * MainNavigator.jsx
 * Production-grade Main Tab Navigator for NIVARA.
 * Integrates bottom tab navigation (Home, Community, Profile) with nested Profile stack routes.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MAIN_ROUTES, PROFILE_ROUTES } from '../constants/routes';
import { useTheme } from '../theme';
import { BRAND_COLORS } from '../constants/colors';
import useUserStore from '../store/userStore';

import HomeNavigator from './HomeNavigator';
import CommunityNavigator from './CommunityNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import AboutScreen from '../screens/profile/AboutScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileNavigatorStack() {
  return (
    <ProfileStack.Navigator
      initialRouteName={PROFILE_ROUTES.PROFILE}
      screenOptions={{ headerShown: false }}
    >
      <ProfileStack.Screen name={PROFILE_ROUTES.PROFILE} component={ProfileScreen} />
      <ProfileStack.Screen name={PROFILE_ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <ProfileStack.Screen name={PROFILE_ROUTES.SETTINGS} component={SettingsScreen} />
      <ProfileStack.Screen name={PROFILE_ROUTES.PRIVACY} component={PrivacyScreen} />
      <ProfileStack.Screen name={PROFILE_ROUTES.NOTIFICATION_SETTINGS} component={NotificationSettingsScreen} />
      <ProfileStack.Screen name={PROFILE_ROUTES.ABOUT} component={AboutScreen} />
    </ProfileStack.Navigator>
  );
}

export const MainNavigator = () => {
  const { theme } = useTheme();
  const { colors, typography, shadows } = theme;

  return (
    <Tab.Navigator
      initialRouteName={MAIN_ROUTES.HOME_TAB}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          ...shadows.small,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.bold,
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🏠';
          if (route.name === MAIN_ROUTES.HOME_TAB) {
            icon = focused ? '🏠' : '🏠';
          } else if (route.name === MAIN_ROUTES.COMMUNITY_TAB) {
            icon = focused ? '💬' : '💬';
          } else if (route.name === MAIN_ROUTES.PROFILE_TAB) {
            icon = focused ? '👤' : '👤';
          }
          return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen
        name={MAIN_ROUTES.HOME_TAB}
        component={HomeNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name={MAIN_ROUTES.COMMUNITY_TAB}
        component={CommunityNavigator}
        options={{ tabBarLabel: 'Community' }}
      />
      <Tab.Screen
        name={MAIN_ROUTES.PROFILE_TAB}
        component={ProfileNavigatorStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
