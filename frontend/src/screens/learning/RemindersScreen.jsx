import React from 'react';
import { View, Text, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import ReminderCard from '../../components/learning/ReminderCard';
import useLearningStore from '../../store/learningStore';

export const RemindersScreen = ({ navigation }) => {
  const { reminders } = useLearningStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Reminders & Alarms" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ReminderCard reminder={item} onToggle={() => {}} />}
      />
    </SafeAreaWrapper>
  );
};

export default RemindersScreen;
