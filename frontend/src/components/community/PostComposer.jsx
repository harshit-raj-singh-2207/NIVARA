/**
 * PostComposer.jsx
 * Inline feed post composer trigger card component.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';

export const PostComposer = ({ onPress, placeholder = 'Share a sensory tip or ask the community...' }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: 10,
          marginBottom: 12,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.row}>
        <Avatar name="User" size="small" />
        <Text
          style={{
            color: colors.textMuted,
            fontSize: typography.sizes.xs,
            marginLeft: 10,
            flex: 1,
          }}
        >
          {placeholder}
        </Text>
        <Text style={{ fontSize: 18 }}>✏️</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PostComposer;
