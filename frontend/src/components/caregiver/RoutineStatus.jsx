/**
 * RoutineStatus.jsx
 * Active daily routine step and completion progress tracker card component.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const RoutineStatus = ({ routine }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const activeTask = routine?.activeTaskTitle || 'Morning Hygiene & Bathing';
  const progressPct = routine?.progressPercentage ?? 60;
  const completed = routine?.completedCount ?? 3;
  const total = routine?.totalCount ?? 5;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          padding: 10,
          marginBottom: 8,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, marginRight: 6 }}>📋</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            Active Routine Task
          </Text>
          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: 'bold' }}>
            {activeTask}
          </Text>
        </View>

        <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
          {completed}/{total} Steps ({progressPct}%)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RoutineStatus;
