/**
 * CommunityHomeScreen.jsx
 * Complete, production-grade Community Hub Screen for NIVARA.
 * Features DMs, peer support groups, and a social community feed with topic filtering.
 */

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { BRAND_COLORS, STATUS_COLORS } from '../../constants/colors';
import useCommunityStore from '../../store/communityStore';
import useChatStore from '../../store/chatStore';
import communityApi from '../../services/api/communityApi';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';

import ChatListItem from '../../components/community/ChatListItem';
import GroupCard from '../../components/community/GroupCard';
import CommunityPost from '../../components/community/CommunityPost';
import PostComposer from '../../components/community/PostComposer';
import CommunityFilter from '../../components/community/CommunityFilter';
import ResourceCard from '../../components/community/ResourceCard';

export const CommunityHomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'groups' | 'feed'

  const {
    posts,
    groups,
    resources,
    selectedCategory,
    searchQuery,
    isLoading: isCommunityLoading,
    setSelectedCategory,
    setSearchQuery,
    fetchCommunityData,
    toggleLikePost,
    toggleJoinGroup,
  } = useCommunityStore();

  const {
    chats,
    isLoading: isChatLoading,
    fetchChats,
  } = useChatStore();

  useEffect(() => {
    fetchChats();
    fetchCommunityData();
  }, []);

  const isLoading = isCommunityLoading || isChatLoading;

  const handleRefresh = () => {
    fetchChats();
    fetchCommunityData();
  };

  // Search filtering logic
  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Community & Peer Hub"
        subtitle="Direct Messaging, Peer Groups & Resources"
        showBack={false}
      />

      {isLoading && <Loading overlay={true} size="large" message="Syncing community hub..." />}

      {/* SEARCH BAR & QUICK CREATION ACTION BAR */}
      <View style={[styles.topActionBar, { paddingHorizontal: spacing.lg, paddingTop: spacing.sm }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search DMs, groups, or posts..."
          onClear={() => setSearchQuery('')}
          style={{ marginBottom: spacing.sm }}
        />

        <View style={styles.quickTriggerRow}>
          <AppButton
            title="✏️ New Post"
            onPress={() => (navigation ? navigation.navigate('CreatePostScreen') : null)}
            variant="secondary"
            size="small"
            style={{ flex: 1, marginRight: 6 }}
          />
          <AppButton
            title="💬 Start Chat"
            onPress={() => (navigation ? navigation.navigate('NewChatScreen') : null)}
            variant="primary"
            size="small"
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* SEGMENTED TAB CONTROLLER */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[
          { id: 'chats', label: '💬 Messages' },
          { id: 'groups', label: '👥 Peer Groups' },
          { id: 'feed', label: '📰 Feed & Resources' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabItem,
                {
                  borderBottomColor: isActive ? colors.primary : 'transparent',
                  borderBottomWidth: isActive ? 3 : 0,
                },
              ]}
            >
              <Text
                style={{
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontSize: typography.sizes.xs,
                  fontWeight: isActive ? typography.weights.bold : typography.weights.medium,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TAB CONTENT VIEWS */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* TAB 1: DIRECT MESSAGES */}
        {activeTab === 'chats' && (
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              💬 Active Direct Messages & Caregiver Chats
            </Text>

            {filteredChats.length > 0 ? (
              filteredChats.map((chatItem) => (
                <ChatListItem
                  key={chatItem.id}
                  chat={chatItem}
                  onPress={() => (navigation ? navigation.navigate('DirectMessageScreen', { chatId: chatItem.id, chatName: chatItem.name }) : null)}
                />
              ))
            ) : (
              <EmptyState
                icon="💬"
                title="No Messages Found"
                description="Start a new conversation with a caregiver or peer."
                actionTitle="Start New Chat"
                onActionPress={() => (navigation ? navigation.navigate('NewChatScreen') : null)}
              />
            )}
          </View>
        )}

        {/* TAB 2: PEER SUPPORT GROUPS */}
        {activeTab === 'groups' && (
          <View>
            <View style={styles.groupHeaderRow}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                👥 Peer Support Groups & Circles
              </Text>
              <TouchableOpacity onPress={() => (navigation ? navigation.navigate('CreateGroupScreen') : null)}>
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: 'bold' }}>
                  + Create Group
                </Text>
              </TouchableOpacity>
            </View>

            {filteredGroups.length > 0 ? (
              filteredGroups.map((groupItem) => (
                <GroupCard
                  key={groupItem.id}
                  group={groupItem}
                  onJoin={() => toggleJoinGroup(groupItem.id)}
                  onPress={() => (navigation ? navigation.navigate('GroupChatScreen', { groupId: groupItem.id, groupName: groupItem.name }) : null)}
                />
              ))
            ) : (
              <EmptyState
                icon="👥"
                title="No Groups Found"
                description="Explore peer support groups or create a new community circle."
              />
            )}
          </View>
        )}

        {/* TAB 3: SOCIAL FEED & EDUCATIONAL RESOURCES */}
        {activeTab === 'feed' && (
          <View>
            {/* Inline Post Composer Trigger */}
            <PostComposer
              onPress={() => (navigation ? navigation.navigate('CreatePostScreen') : null)}
            />

            {/* Category Topic Filters */}
            <CommunityFilter
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              style={{ marginBottom: spacing.md }}
            />

            {/* Educational Resources Section */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              📖 Featured Community Guides
            </Text>

            {resources.map((resItem) => (
              <ResourceCard key={resItem.id} resource={resItem} />
            ))}

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                  marginTop: spacing.md,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              📰 Community Feed Posts
            </Text>

            {filteredPosts.length > 0 ? (
              filteredPosts.map((postItem) => (
                <CommunityPost
                  key={postItem.id}
                  post={postItem}
                  onLike={() => toggleLikePost(postItem.id)}
                  onComment={() => (navigation ? navigation.navigate('PostDetailsScreen', { postId: postItem.id }) : null)}
                  onPress={() => (navigation ? navigation.navigate('PostDetailsScreen', { postId: postItem.id }) : null)}
                />
              ))
            ) : (
              <EmptyState
                icon="📰"
                title="No Posts Found"
                description="Be the first to share a sensory tip or ask a question in this category!"
                actionTitle="Create Post"
                onActionPress={() => (navigation ? navigation.navigate('CreatePostScreen') : null)}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActionBar: {
    marginBottom: 4,
  },
  quickTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    textAlign: 'left',
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default CommunityHomeScreen;
