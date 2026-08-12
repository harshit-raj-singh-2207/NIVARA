/**
 * ReminderCard.jsx
 * Banner alert component notifying user of upcoming schedule transitions and routine steps.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const ReminderCard = ({ reminder, onPress, onDismiss }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!reminder) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.status.warningBackground,
          borderColor: colors.status.warning,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 12,
          ...shadows.small,
        },
      ]}
    >
      <Text style={{ fontSize: 24, marginRight: 10 }}>{reminder.icon || '⏰'}</Text>

      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text
            style={{
              color: colors.status.warning,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.bold,
            }}
          >
            TRANSITION WARNING • {reminder.time || 'Upcoming'}
          </Text>
        </View>

        <Text
          style={{
            color: colors.text,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.bold,
            marginTop: 2,
          }}
        >
          {reminder.title}
        </Text>

        <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
          {reminder.description || 'Get ready to switch activities in 10 minutes.'}
        </Text>
      </View>

      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
          <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dismissBtn: {
    padding: 6,
    marginLeft: 6,
  },
});

export default ReminderCard;
