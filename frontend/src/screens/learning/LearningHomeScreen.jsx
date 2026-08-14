import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import RoutineCard from '../../components/learning/RoutineCard';
import LearningCard from '../../components/learning/LearningCard';
import AppCard from '../../components/common/AppCard';
import useLearningStore from '../../store/learningStore';

export const LearningHomeScreen = ({ navigation }) => {
  const { routines, learningTopics } = useLearningStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Routines & Companion" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <AppCard
          onPress={() => navigation.navigate('Tutor')}
          className="bg-indigo-600 border-transparent p-5 mb-6"
        >
          <Text className="text-white font-black text-xl mb-1">🤖 AI Learning Companion</Text>
          <Text className="text-indigo-100 text-xs">Interactive step-by-step guidance, social cues & wind-down support.</Text>
        </AppCard>

        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Daily Routines</Text>
        {routines.map(item => (
          <RoutineCard
            key={item.id}
            routine={item}
            onPress={() => navigation.navigate('RoutineDetails', { routineId: item.id })}
          />
        ))}

        <Text className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">Interactive Modules</Text>
        {learningTopics.map(topic => (
          <LearningCard
            key={topic.id}
            topic={topic}
            onPress={() => navigation.navigate('LearningTopics', { topicId: topic.id })}
          />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default LearningHomeScreen;
