/**
 * ResourceCard.jsx
 * Community educational resource card component.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const ResourceCard = ({ resource, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!resource) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.primaryLight,
          borderRadius: borderRadius.lg,
          padding: 10,
          marginBottom: 8,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.row}>
        <Text style={{ fontSize: 22, marginRight: 8 }}>📖</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            {resource.title}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 10, marginTop: 2 }}>
            {resource.description || 'Guide for managing sensory overload and building routines.'}
          </Text>
        </View>
        <Text style={{ color: colors.primary, fontSize: 16 }}>›</Text>
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

export default ResourceCard;
