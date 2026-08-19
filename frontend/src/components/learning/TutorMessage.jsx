/**
 * TutorMessage.jsx
 * AI Adaptive Learning Tutor message bubble / hint component.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const TutorMessage = ({ text, title = 'AI Learning Assistant' }) => {
  if (!text) return null;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🤖</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.body}>{text}</Text>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: BRAND_COLORS.primaryLight + '10',
    borderColor: BRAND_COLORS.primaryLight + '30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  avatar: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: BRAND_COLORS.primary,
  },
  body: {
    fontSize: FONT_SIZES.sm,
    color: '#302B2D',
    lineHeight: 20,
  },
});

export default TutorMessage;
