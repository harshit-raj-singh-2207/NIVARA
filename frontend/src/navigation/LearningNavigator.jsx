import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LEARNING_ROUTES as R } from '../constants/routes';
import LearningHomeScreen from '../screens/learning/LearningHomeScreen';
import RoutineScreen from '../screens/learning/RoutineScreen';
import RoutineDetailsScreen from '../screens/learning/RoutineDetailsScreen';
import TaskDetailsScreen from '../screens/learning/TaskDetailsScreen';
import LearningTopicsScreen from '../screens/learning/LearningTopicsScreen';
import TutorScreen from '../screens/learning/TutorScreen';
import RemindersScreen from '../screens/learning/RemindersScreen';
const Stack = createNativeStackNavigator();
export default function LearningNavigator() {
  return <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={R.HOME} component={LearningHomeScreen} /><Stack.Screen name={R.ROUTINES} component={RoutineScreen} />
    <Stack.Screen name={R.ROUTINE_DETAILS} component={RoutineDetailsScreen} /><Stack.Screen name={R.TASK_DETAILS} component={TaskDetailsScreen} />
    <Stack.Screen name={R.TOPICS} component={LearningTopicsScreen} /><Stack.Screen name={R.TUTOR} component={TutorScreen} />
    <Stack.Screen name={R.REMINDERS} component={RemindersScreen} />
  </Stack.Navigator>;
}
