/**
 * RoutineCard.jsx
 * Daily routine schedule card component (Morning, Afternoon, Evening).
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const RoutineCard = ({ routine, isSelected = false, onPress }) => {
  if (!routine) return null;

  const { title, time, icon, tasks } = routine;
  const taskCount = tasks ? tasks.length : 0;

  return (
    <AppCard style={[styles.card, isSelected && styles.selectedCard]}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon || '⏰'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time} • {taskCount} tasks</Text>
        </View>
        <Text style={styles.arrow}>{isSelected ? '🔵' : '⚪'}</Text>
      </TouchableOpacity>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: BRAND_COLORS.primary,
    borderWidth: 2,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: BRAND_COLORS.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
    marginTop: 2,
  },
  arrow: {
    fontSize: 16,
  },
});

export default RoutineCard;
