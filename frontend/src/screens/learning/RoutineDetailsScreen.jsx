import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import TaskStep from '../../components/learning/TaskStep';
import useLearningStore from '../../store/learningStore';

export const RoutineDetailsScreen = ({ route, navigation }) => {
  const { routineId } = route.params || {};
  const { routines, toggleStep } = useLearningStore();
  const routine = routines.find(r => r.id === routineId) || routines[0];

  return (
    <SafeAreaWrapper>
      <AppHeader title={routine.title} showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-sm font-semibold text-indigo-600 mb-1">{routine.time} • {routine.category}</Text>
        <Text className="text-2xl font-black text-slate-900 dark:text-white mb-4">{routine.title}</Text>

        <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Steps Checklist</Text>
        {routine.steps.map(step => (
          <TaskStep key={step.id} step={step} onToggle={() => toggleStep(routine.id, step.id)} />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default RoutineDetailsScreen;
