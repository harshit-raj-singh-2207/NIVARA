/**
 * LearningCard.jsx
 * Interactive topic lesson card component for the Learning module.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const LearningCard = ({ topic, onPress }) => {
  if (!topic) return null;

  const { title, category, progress, icon } = topic;

  return (
    <AppCard style={styles.card}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon || '📚'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          {category ? <Text style={styles.category}>{category}</Text> : null}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{progress != null ? `${progress}%` : 'Start'}</Text>
        </View>
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
    color: '#302B2D',
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: '#766D70',
    marginTop: 2,
  },
  badge: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
});

export default LearningCard;
