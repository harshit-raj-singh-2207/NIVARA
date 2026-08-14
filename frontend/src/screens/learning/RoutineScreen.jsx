import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import RoutineTimeline from '../../components/learning/RoutineTimeline';
import useLearningStore from '../../store/learningStore';

export const RoutineScreen = ({ navigation }) => {
  const { routines } = useLearningStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Daily Schedule" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Routine Timeline</Text>
        <RoutineTimeline routines={routines} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default RoutineScreen;
