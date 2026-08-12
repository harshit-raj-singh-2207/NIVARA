/**
 * TaskStep.jsx
 * Interactive step item with checkbox for routine task breakdown.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const TaskStep = ({ step, onToggleStep, index }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const completed = step?.completed || false;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggleStep && onToggleStep(step.id)}
      style={[
        styles.container,
        {
          backgroundColor: completed ? colors.status.successBackground : colors.surface,
          borderColor: completed ? colors.status.success : colors.border,
          borderRadius: borderRadius.md,
          padding: 10,
          marginBottom: 6,
        },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: completed ? colors.status.success : colors.surfaceSubtle,
            borderColor: completed ? colors.status.success : colors.border,
            borderRadius: borderRadius.sm,
          },
        ]}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
          {completed ? '✓' : ''}
        </Text>
      </View>

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{
            color: completed ? colors.textSecondary : colors.text,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.bold,
            textDecorationLine: completed ? 'line-through' : 'none',
          }}
        >
          {index != null ? `${index + 1}. ` : ''}{step.title}
        </Text>

        {step.description ? (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.sizes.xs,
              marginTop: 2,
            }}
          >
            {step.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});

export default TaskStep;
