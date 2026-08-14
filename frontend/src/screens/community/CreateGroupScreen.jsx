import React, { useState } from 'react';
import { View } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

export const CreateGroupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaWrapper>
      <AppHeader title="Create Support Group" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-6">
        <AppInput label="Group Name" placeholder="e.g. Tactile Sensory Support" value={name} onChangeText={setName} />
        <AppInput label="Description" placeholder="What is this group about?" value={description} onChangeText={setDescription} />
        <AppButton title="Create Group" onPress={() => navigation.goBack()} size="lg" className="mt-4" />
      </View>
    </SafeAreaWrapper>
  );
};

export default CreateGroupScreen;
