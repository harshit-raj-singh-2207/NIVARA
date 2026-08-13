import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COMMUNICATION_ROUTES as R } from '../constants/routes';
import CommunicationScreen from '../screens/communication/CommunicationScreen';
import AACScreen from '../screens/communication/AACScreen';
import EmotionScreen from '../screens/communication/EmotionScreen';
import QuickCommunicationScreen from '../screens/communication/QuickCommunicationScreen';
import CommunicationHistoryScreen from '../screens/communication/CommunicationHistoryScreen';
const Stack = createNativeStackNavigator();
export default function CommunicationNavigator() {
  return <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={R.HOME} component={CommunicationScreen} /><Stack.Screen name={R.AAC} component={AACScreen} />
    <Stack.Screen name={R.EMOTION} component={EmotionScreen} /><Stack.Screen name={R.QUICK} component={QuickCommunicationScreen} />
    <Stack.Screen name={R.HISTORY} component={CommunicationHistoryScreen} />
  </Stack.Navigator>;
}
