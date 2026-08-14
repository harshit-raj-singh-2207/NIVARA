import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import AppButton from '../common/AppButton';

export const PostComposer = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-4">
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Share an insight or ask the caregiver community..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        className="text-sm text-slate-900 dark:text-white p-0 mb-3 min-h-[70px]"
      />
      <AppButton title="Post to Community" size="sm" onPress={handlePost} fullWidth={false} className="self-end" />
    </View>
  );
};

export default PostComposer;
