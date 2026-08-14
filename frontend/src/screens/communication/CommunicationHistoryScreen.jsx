import React from 'react';
import { View, Text, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import SpeechButton from '../../components/communication/SpeechButton';

const MOCK_HISTORY = [
  { id: 'h1', phrase: 'I need water please', time: '10 mins ago' },
  { id: 'h2', phrase: 'I am feeling overwhelmed by noise', time: '1 hour ago' },
  { id: 'h3', phrase: 'Can we go to the quiet room?', time: '3 hours ago' },
];

export const CommunicationHistoryScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Speech History" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <AppCard className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-slate-900 dark:text-white">"{item.phrase}"</Text>
              <Text className="text-xs text-slate-400 mt-1">{item.time}</Text>
            </View>
            <SpeechButton text={item.phrase} size="md" />
          </AppCard>
        )}
      />
    </SafeAreaWrapper>
  );
};

export default CommunicationHistoryScreen;
