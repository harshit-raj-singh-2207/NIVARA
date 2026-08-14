import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AttachmentButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
      <Ionicons name="attach-outline" size={20} color="#6366F1" />
    </TouchableOpacity>
  );
};

export default AttachmentButton;
