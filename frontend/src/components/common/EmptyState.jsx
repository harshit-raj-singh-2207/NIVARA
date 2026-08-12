/**
 * Accessible Reusable Empty State View for NIVARA.
 * Displays soothing icon/illustration placeholder, heading title, message, and call-to-action button.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import AppButton from './AppButton';

export const EmptyState = ({
  icon = '📭',
  title = 'No items found',
  description = 'There is no data to display right now.',
  actionTitle,
  onActionPress,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          padding: spacing.xl,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel || `${title}. ${description}`}
    >
      {icon && (
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: theme.borderRadius.full,
              padding: spacing.lg,
              marginBottom: spacing.md,
            },
          ]}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </View>
      )}

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.bold,
            marginBottom: spacing.xs,
          },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.lg,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {actionTitle && onActionPress && (
        <AppButton
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="medium"
          fullWidth={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default EmptyState;
