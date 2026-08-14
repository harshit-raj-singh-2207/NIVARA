import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import EmotionSelector from '../../components/communication/EmotionSelector';
import useCommunicationStore from '../../store/communicationStore';

export const EmotionScreen = ({ navigation }) => {
  const [selectedEmotion, setSelectedEmotion] = useState('Calm');
  const [intensity, setIntensity] = useState(7);
  const [note, setNote] = useState('');
  const { logEmotion, emotionHistory } = useCommunicationStore();

  const handleSave = () => {
    logEmotion({ emotion: selectedEmotion, intensity, note });
    setNote('');
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Emotion Logger" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">How are you feeling right now?</Text>
        <EmotionSelector selectedEmotion={selectedEmotion} onSelectEmotion={setSelectedEmotion} />

        <View className="my-4">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Feeling Intensity (1 to 10): {intensity}</Text>
          <View className="flex-row space-x-2">
            {[1, 3, 5, 7, 10].map(val => (
              <AppButton
                key={val}
                title={`${val}`}
                variant={intensity === val ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setIntensity(val)}
                className="flex-1"
              />
            ))}
          </View>
        </View>

        <AppInput
          label="Notes / Trigger Context (Optional)"
          placeholder="e.g. Loud sounds in cafeteria"
          value={note}
          onChangeText={setNote}
        />

        <AppButton title="Log Emotion" onPress={handleSave} size="lg" className="mb-6" />

        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Recent Emotion History</Text>
        {emotionHistory.map(item => (
          <AppCard key={item.id} className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">{item.emotion}</Text>
              {item.note ? <Text className="text-xs text-slate-500 mt-0.5">{item.note}</Text> : null}
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-indigo-600">Level {item.intensity}/10</Text>
              <Text className="text-[10px] text-slate-400 mt-0.5">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default EmotionScreen;
