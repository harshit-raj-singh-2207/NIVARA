import React from 'react';
import { View, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import CommunityPost from '../../components/community/CommunityPost';
import useCommunityStore from '../../store/communityStore';

export const CommunityFeedScreen = ({ navigation }) => {
  const { posts, toggleLikePost } = useCommunityStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Community Feed" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <CommunityPost post={item} onLike={toggleLikePost} onComment={() => {}} />
        )}
      />
    </SafeAreaWrapper>
  );
};

export default CommunityFeedScreen;
