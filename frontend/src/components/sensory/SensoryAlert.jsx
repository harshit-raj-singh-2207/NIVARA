/**
 * SensoryAlert.jsx
 * Active sensory warning banner recommending calming actions or location changes.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const SensoryAlert = ({ alert, onAction, onDismiss }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!alert) return null;

  const isWarning = alert.severity === 'warning';
  const isCritical = alert.severity === 'critical';

  let bg = colors.status.warningBackground;
  let borderColor = colors.status.warning;
  let textColor = colors.status.warning;
  let icon = '🔊';

  if (isCritical) {
    bg = colors.status.errorBackground;
    borderColor = colors.status.error;
    textColor = colors.status.error;
    icon = '🚨';
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: bg,
          borderColor: borderColor,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 12,
          ...shadows.small,
        },
      ]}
    >
      <Text style={{ fontSize: 26, marginRight: 10 }}>{icon}</Text>

      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
          SENSORY OVERLOAD WARNING
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.bold,
            marginTop: 2,
          }}
        >
          {alert.title}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
          {alert.message}
        </Text>

        {alert.recommendedAction && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAction}
            style={[
              styles.actionBtn,
              {
                backgroundColor: textColor,
                borderRadius: borderRadius.md,
                marginTop: 8,
                paddingVertical: 6,
                paddingHorizontal: 10,
              },
            ]}
          >
            <Text style={{ color: '#FFFFFF', fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
              💡 {alert.recommendedAction}
            </Text>
          </TouchableOpacity>
        )}
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
  actionBtn: {
    alignSelf: 'flex-start',
  },
  dismissBtn: {
    padding: 4,
    marginLeft: 6,
  },
});

export default SensoryAlert;
