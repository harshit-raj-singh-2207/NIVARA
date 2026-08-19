import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityNavigator from './CommunityNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityTab" component={CommunityNavigator} />
    </Stack.Navigator>
  );
}
