/**
 * TaskCard.jsx
 * Expandable task card component with step breakdown checklist.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import TaskStep from './TaskStep';

export const TaskCard = ({ task, onToggleStep, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  const [expanded, setExpanded] = useState(false);

  const steps = task?.steps || [];
  const completedSteps = steps.filter((s) => s.completed).length;
  const isAllCompleted = steps.length > 0 && completedSteps === steps.length;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isAllCompleted
            ? colors.status.successBackground
            : colors.cardBackground,
          borderColor: isAllCompleted ? colors.status.success : colors.border,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 10,
          ...shadows.small,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
        style={styles.cardHeader}
      >
        <Text style={{ fontSize: 24, marginRight: 10 }}>{task.icon || '📋'}</Text>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.bold,
            }}
          >
            {task.title}
          </Text>

          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            ⏰ {task.time || 'Scheduled'} • {completedSteps}/{steps.length} Steps Done
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isAllCompleted
                ? colors.status.success
                : colors.primary,
              borderRadius: borderRadius.full,
              paddingHorizontal: 8,
              paddingVertical: 2,
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
            {isAllCompleted ? 'DONE' : `${completedSteps}/${steps.length}`}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Step Checklist */}
      {expanded && steps.length > 0 && (
        <View style={[styles.stepsList, { marginTop: 10 }]}>
          {steps.map((stepItem, idx) => (
            <TaskStep
              key={stepItem.id || idx}
              step={stepItem}
              index={idx}
              onToggleStep={(stepId) => onToggleStep && onToggleStep(task.id, stepId)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 6,
  },
  stepsList: {
    width: '100%',
  },
});

export default TaskCard;
