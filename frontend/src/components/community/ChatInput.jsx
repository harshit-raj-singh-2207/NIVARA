import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ChatInput = ({ onSend, onAttach }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View className="flex-row items-center p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <TouchableOpacity onPress={onAttach} className="p-2 mr-1">
        <Ionicons name="attach" size={22} color="#64748B" />
      </TouchableOpacity>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor="#94A3B8"
        className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full text-sm text-slate-900 dark:text-white"
      />
      <TouchableOpacity onPress={handleSend} className="bg-indigo-600 p-2.5 rounded-full ml-2">
        <Ionicons name="send" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
