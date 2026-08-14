import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';

const LESSONS = [
  { id: 'l1', title: 'Lesson 1: Recognizing Facial Cues', duration: '5 mins' },
  { id: 'l2', title: 'Lesson 2: Body Language Basics', duration: '7 mins' },
  { id: 'l3', title: 'Lesson 3: Turn-Taking in Conversation', duration: '6 mins' },
];

export const LearningTopicsScreen = ({ route, navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Module Lessons" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Lessons & Exercises</Text>
        {LESSONS.map(l => (
          <AppCard key={l.id} className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">{l.title}</Text>
              <Text className="text-xs text-slate-400 mt-1">{l.duration}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default LearningTopicsScreen;
