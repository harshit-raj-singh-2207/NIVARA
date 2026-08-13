/**
 * CommunityPost.jsx
 * Social community post feed component with likes, comments, and topic categories.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';

export const CommunityPost = ({ post, onLike, onComment, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!post) return null;

  const isLiked = post.isLiked ?? false;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 10,
          ...shadows.small,
        },
      ]}
    >
      {/* Author Header */}
      <View style={styles.authorRow}>
        <Avatar name={post.authorName} size="small" />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            {post.authorName || 'Anonymous Community Member'}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>
            {post.time || '2 hours ago'} • {post.category || 'General'}
          </Text>
        </View>
      </View>

      {/* Post Text Content */}
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.sizes.sm,
            lineHeight: 20,
            marginTop: 8,
            marginBottom: 10,
          }}
        >
          {post.content}
        </Text>
      </TouchableOpacity>

      {/* Action Footer (Likes, Comments) */}
      <View style={[styles.footerRow, { borderTopColor: colors.divider }]}>
        <TouchableOpacity
          onPress={() => onLike && onLike(post.id)}
          style={styles.actionBtn}
        >
          <Text style={{ fontSize: 16, marginRight: 4 }}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={{ color: isLiked ? colors.status.error : colors.textSecondary, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            {post.likes || 0} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onComment && onComment(post.id)}
          style={styles.actionBtn}
        >
          <Text style={{ fontSize: 16, marginRight: 4 }}>💬</Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            {post.commentsCount || 0} Comments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default CommunityPost;
