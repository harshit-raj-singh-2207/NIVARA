import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeNavigator from './HomeNavigator';
import CommunicationNavigator from './CommunicationNavigator';
import LearningNavigator from './LearningNavigator';
import SensoryHomeScreen from '../screens/sensory/SensoryHomeScreen';
import SafetyNavigator from './SafetyNavigator';
import CaregiverNavigator from './CaregiverNavigator';
import CommunityNavigator from './CommunityNavigator';
import ProfileNavigator from './ProfileNavigator';
import useAuthStore from '../store/authStore';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  const { user } = useAuthStore();
  const isCaregiver = user?.role === 'CAREGIVER';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#5B8DEF',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          backgroundColor: '#FFFFFF',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'square';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'CommunicationTab') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'LearningTab') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'SensoryTab') iconName = focused ? 'leaf' : 'leaf-outline';
          else if (route.name === 'SafetyTab') iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          else if (route.name === 'CaregiverTab') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'CommunityTab') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CommunicationTab" component={CommunicationNavigator} options={{ tabBarLabel: 'AAC' }} />
      <Tab.Screen name="LearningTab" component={LearningNavigator} options={{ tabBarLabel: 'Routine' }} />
      <Tab.Screen name="SensoryTab" component={SensoryHomeScreen} options={{ tabBarLabel: 'Sensory' }} />
      <Tab.Screen name="SafetyTab" component={SafetyNavigator} options={{ tabBarLabel: 'Safety' }} />
      {isCaregiver ? (
        <Tab.Screen name="CaregiverTab" component={CaregiverNavigator} options={{ tabBarLabel: 'Dashboard' }} />
      ) : (
        <Tab.Screen name="CommunityTab" component={CommunityNavigator} options={{ tabBarLabel: 'Community' }} />
      )}
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
