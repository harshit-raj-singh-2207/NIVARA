/**
 * GroupCard.jsx
 * Peer support group card component.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const GroupCard = ({ group, onPress, onJoin }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!group) return null;

  const isJoined = group.isJoined ?? false;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 10,
          ...shadows.small,
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.topRow}>
        <Text style={{ fontSize: 24, marginRight: 10 }}>{group.icon || '👥'}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
            }}
          >
            {group.name}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            {group.memberCount || 42} Members • Category: {group.category || 'Peer Support'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onJoin && onJoin(group.id)}
          style={[
            styles.joinBtn,
            {
              backgroundColor: isJoined ? colors.surface : colors.primary,
              borderColor: isJoined ? colors.border : colors.primary,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text
            style={{
              color: isJoined ? colors.textSecondary : '#FFFFFF',
              fontSize: typography.sizes.xs,
              fontWeight: 'bold',
            }}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {group.description ? (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.xs,
            marginTop: 8,
            lineHeight: 18,
          }}
        >
          {group.description}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});

export default GroupCard;
