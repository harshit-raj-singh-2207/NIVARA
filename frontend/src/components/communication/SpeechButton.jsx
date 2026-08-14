import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import textToSpeech from '../../services/audio/textToSpeech';

export const SpeechButton = ({ text, size = 'md' }) => {
  const handleSpeak = () => {
    if (text) {
      textToSpeech.speak(text);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSpeak}
      className="bg-indigo-600 active:bg-indigo-700 p-3 rounded-full flex-row items-center justify-center shadow-sm"
    >
      <Ionicons name="volume-high" size={size === 'lg' ? 24 : 20} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

export default SpeechButton;
