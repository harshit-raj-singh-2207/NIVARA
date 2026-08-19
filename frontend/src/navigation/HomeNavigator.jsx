/**
 * Home Stack Navigator for NIVARA.
 * Connects HomeScreen and NotificationsScreen.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME_ROUTES } from '../constants/routes';

import HomeScreen from '../screens/home/HomeScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import CommunicationNavigator from './CommunicationNavigator';
import LearningNavigator from './LearningNavigator';

const Stack = createNativeStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={HOME_ROUTES.HOME}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={HOME_ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={HOME_ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={HOME_ROUTES.COMMUNICATION} component={CommunicationNavigator} />
      <Stack.Screen name={HOME_ROUTES.LEARNING} component={LearningNavigator} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
