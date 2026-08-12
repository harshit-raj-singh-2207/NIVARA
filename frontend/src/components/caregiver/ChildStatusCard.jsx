/**
 * ChildStatusCard.jsx
 * Dependent child status profile header card component for caregiver monitoring.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';

export const ChildStatusCard = ({ dependent, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!dependent) return null;

  const isOnline = dependent.isOnline ?? true;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 12,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.row}>
        <Avatar name={dependent.name} size="medium" />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={styles.titleRow}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
              }}
            >
              {dependent.name}
            </Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isOnline ? colors.status.success : colors.textMuted,
                  borderRadius: borderRadius.full,
                },
              ]}
            />
          </View>

          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            Role: Dependent User • Age: {dependent.age || '12'}
          </Text>

          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: 'bold', marginTop: 4 }}>
            State: {dependent.emotionalState || 'Calm'} • Noise: {dependent.noiseDb || '72'} dB
          </Text>
        </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 10,
    height: 10,
  },
});

export default ChildStatusCard;
