/**
 * Accessible Reusable Header Component for NIVARA.
 * Displays screen title, subtitle, back navigation button, and right action buttons.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const AppHeader = ({
  title,
  subtitle,
  onBackPress,
  rightComponent,
  showBack = false,
  style,
  titleStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel || title}
    >
      <View style={styles.leftContainer}>
        {showBack && onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[styles.backButton, { marginRight: spacing.sm }]}
          >
            <Text style={[styles.backText, { color: colors.primary, fontSize: typography.sizes.lg }]}>
              ←
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.bold,
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.medium,
                  marginTop: 2,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightComponent && <View style={styles.rightContainer}>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    textAlign: 'left',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default AppHeader;
