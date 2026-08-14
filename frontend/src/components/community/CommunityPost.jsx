import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';
import Avatar from '../common/Avatar';

export const CommunityPost = ({ post, onLike, onComment }) => {
  return (
    <AppCard>
      <View className="flex-row items-center space-x-3 mb-3">
        <Avatar source={post.authorAvatar} name={post.authorName} size="md" />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{post.authorName}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">{post.authorRole} • {post.createdAt}</Text>
        </View>
      </View>
      <Text className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed mb-3">{post.content}</Text>
      <View className="flex-row items-center space-x-4 border-t border-slate-100 dark:border-slate-700/60 pt-3 mt-1">
        <TouchableOpacity onPress={() => onLike(post.id)} className="flex-row items-center space-x-1.5">
          <Ionicons name={post.isLiked ? 'heart' : 'heart-outline'} size={20} color={post.isLiked ? '#EF4444' : '#64748B'} />
          <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-1">{post.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onComment(post.id)} className="flex-row items-center space-x-1.5 ml-4">
          <Ionicons name="chatbubble-outline" size={18} color="#64748B" />
          <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-1">{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
};

export default CommunityPost;
