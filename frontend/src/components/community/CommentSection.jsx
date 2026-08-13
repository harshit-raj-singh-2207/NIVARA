/**
 * CommentSection.jsx
 * Inline comment list and reply composer for community feed posts.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Avatar from '../common/Avatar';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const CommentSection = ({ comments = [], onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    if (onAddComment) onAddComment(commentText.trim());
    setCommentText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Comments ({comments.length})</Text>

      {comments.map((comment, index) => (
        <View key={comment.id || index} style={styles.commentRow}>
          <Avatar size="xs" name={comment.authorName} source={comment.authorAvatar} />
          <View style={styles.commentContent}>
            <Text style={styles.authorName}>{comment.authorName || 'Community Member'}</Text>
            <Text style={styles.bodyText}>{comment.text || comment.content}</Text>
          </View>
        </View>
      ))}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#94A3B8"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.postBtn} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#64748B',
    marginBottom: SPACING.xs,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  commentContent: {
    flex: 1,
    marginLeft: SPACING.xs,
    backgroundColor: '#F8FAFC',
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  authorName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
  },
  bodyText: {
    fontSize: FONT_SIZES.xs,
    color: '#334155',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.xs,
    color: '#0F172A',
  },
  postBtn: {
    marginLeft: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  postBtnText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
});

export default CommentSection;
