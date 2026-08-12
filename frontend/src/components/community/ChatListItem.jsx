/**
 * ChatListItem.jsx
 * Direct message conversation list item with unread badge and online indicator.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';
import OnlineIndicator from './OnlineIndicator';

export const ChatListItem = ({ chat, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!chat) return null;

  const isOnline = chat.isOnline ?? true;
  const unreadCount = chat.unreadCount || 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: 10,
          marginBottom: 8,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.avatarWrapper}>
        <Avatar name={chat.name} size="medium" />
        <OnlineIndicator isOnline={isOnline} style={styles.onlineDot} />
      </View>

      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={styles.topRow}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
            }}
          >
            {chat.name}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>
            {chat.time || '10:45 AM'}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={{
            color: unreadCount > 0 ? colors.text : colors.textSecondary,
            fontSize: typography.sizes.xs,
            fontWeight: unreadCount > 0 ? typography.weights.bold : typography.weights.regular,
            marginTop: 2,
          }}
        >
          {chat.lastMessage || 'Sent a message'}
        </Text>
      </View>

      {unreadCount > 0 && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
            {unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginLeft: 6,
  },
});

export default ChatListItem;
