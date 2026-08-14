import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AACGrid from '../../components/communication/AACGrid';
import SpeechButton from '../../components/communication/SpeechButton';
import useCommunicationStore from '../../store/communicationStore';

const CATEGORIES = ['NEEDS', 'EMOTIONS', 'ACTIVITIES', 'PEOPLE'];

export const AACScreen = ({ navigation }) => {
  const {
    activeCategory,
    setActiveCategory,
    aacCards,
    selectedSentence,
    addToSentence,
    removeFromSentence,
    clearSentence,
  } = useCommunicationStore();

  const filteredCards = aacCards.filter(c => c.category === activeCategory);
  const sentenceText = selectedSentence.map(s => s.label).join(' ');

  return (
    <SafeAreaWrapper>
      <AppHeader title="AAC Board" showBack onBackPress={() => navigation.goBack()} />

      {/* Sentence Strip */}
      <View className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Composed Sentence</Text>
        <View className="flex-row items-center justify-between min-h-[50px] bg-slate-50 dark:bg-slate-900 rounded-2xl p-2 px-3 border border-slate-200 dark:border-slate-800">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row flex-1">
            {selectedSentence.length === 0 ? (
              <Text className="text-sm text-slate-400 italic self-center">Tap cards below to compose...</Text>
            ) : (
              selectedSentence.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => removeFromSentence(idx)}
                  style={{ backgroundColor: item.color || '#6366F1' }}
                  className="px-3 py-1.5 rounded-xl mr-2 flex-row items-center"
                >
                  <Text className="text-white font-bold text-sm">{item.label}</Text>
                  <Ionicons name="close-circle" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          {selectedSentence.length > 0 && (
            <View className="flex-row items-center space-x-2 ml-2">
              <TouchableOpacity onPress={clearSentence} className="p-2">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <SpeechButton text={sentenceText} size="lg" />
            </View>
          )}
        </View>
      </View>

      {/* Category Selector Tabs */}
      <View className="flex-row p-2 bg-slate-100 dark:bg-slate-900">
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            className={`flex-1 py-2.5 rounded-xl items-center mx-1 ${
              activeCategory === cat ? 'bg-indigo-600' : 'bg-white dark:bg-slate-800'
            }`}
          >
            <Text className={`text-xs font-bold ${activeCategory === cat ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <View className="flex-1">
        <AACGrid items={filteredCards} onItemPress={addToSentence} />
      </View>
    </SafeAreaWrapper>
  );
};

export default AACScreen;
