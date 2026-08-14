import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import CommunityFilter from '../../components/community/CommunityFilter';
import CommunityPost from '../../components/community/CommunityPost';
import PostComposer from '../../components/community/PostComposer';
import GroupCard from '../../components/community/GroupCard';
import useCommunityStore from '../../store/communityStore';

export const CommunityHomeScreen = ({ navigation }) => {
  const { posts, groups, activeFilter, setFilter, toggleLikePost, addPost } = useCommunityStore();

  return (
    <SafeAreaWrapper>
      <AppHeader
        title="Community & Peer Support"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('ChatList')} className="p-2">
            <Ionicons name="chatbubbles-outline" size={24} color="#6366F1" />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <CommunityFilter activeFilter={activeFilter} onSelectFilter={setFilter} />

        <PostComposer onSubmit={(text) => addPost(text, ['Support'])} />

        <View className="flex-row items-center justify-between mb-3 mt-2">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Featured Support Groups</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
            <Text className="text-xs font-bold text-indigo-600">Explore Groups</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-6">
          {groups.map(group => (
            <View key={group.id} className="w-64 mr-3">
              <GroupCard group={group} onJoin={() => {}} />
            </View>
          ))}
        </ScrollView>

        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Community Discussions</Text>
        {posts.map(post => (
          <CommunityPost key={post.id} post={post} onLike={toggleLikePost} onComment={() => {}} />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CommunityHomeScreen;
