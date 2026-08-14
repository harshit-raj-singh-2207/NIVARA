import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import TutorMessage from '../../components/learning/TutorMessage';
import useLearningStore from '../../store/learningStore';

export const TutorScreen = ({ navigation }) => {
  const { tutorMessages, sendTutorPrompt } = useLearningStore();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      sendTutorPrompt(inputText.trim());
      setInputText('');
    }
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="AI Learning Companion" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={tutorMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TutorMessage message={item} />}
      />
      <View className="flex-row items-center p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask AI Companion..."
          placeholderTextColor="#94A3B8"
          className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full text-sm text-slate-900 dark:text-white"
        />
        <TouchableOpacity onPress={handleSend} className="bg-indigo-600 p-2.5 rounded-full ml-2">
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default TutorScreen;
