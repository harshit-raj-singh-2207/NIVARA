import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunicationScreen from '../screens/communication/CommunicationScreen';
import AACScreen from '../screens/communication/AACScreen';
import EmotionScreen from '../screens/communication/EmotionScreen';
import QuickCommunicationScreen from '../screens/communication/QuickCommunicationScreen';
import CommunicationHistoryScreen from '../screens/communication/CommunicationHistoryScreen';

const Stack = createNativeStackNavigator();

export const CommunicationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunicationMain" component={CommunicationScreen} />
      <Stack.Screen name="AAC" component={AACScreen} />
      <Stack.Screen name="Emotion" component={EmotionScreen} />
      <Stack.Screen name="QuickCommunication" component={QuickCommunicationScreen} />
      <Stack.Screen name="CommunicationHistory" component={CommunicationHistoryScreen} />
    </Stack.Navigator>
  );
};

export default CommunicationNavigator;
