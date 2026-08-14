import React, { useState } from 'react';
import { View } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import PostComposer from '../../components/community/PostComposer';
import useCommunityStore from '../../store/communityStore';

export const CreatePostScreen = ({ navigation }) => {
  const { addPost } = useCommunityStore();

  const handlePost = (text) => {
    addPost(text);
    navigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Create Discussion Post" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-4">
        <PostComposer onSubmit={handlePost} />
      </View>
    </SafeAreaWrapper>
  );
};

export default CreatePostScreen;
