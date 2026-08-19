/**
 * MessageExplanation.jsx
 * Displays AI text simplification breakdown or explanation rules.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const MessageExplanation = ({ originalText, simplifiedText, explanation }) => {
  if (!originalText && !simplifiedText) return null;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>✨</Text>
        <Text style={styles.headerTitle}>AI Text Adaptation Breakdown</Text>
      </View>
      
      {originalText ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Original Input:</Text>
          <Text style={styles.originalText}>{originalText}</Text>
        </View>
      ) : null}

      {simplifiedText ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Simplified Text:</Text>
          <Text style={styles.simplifiedText}>{simplifiedText}</Text>
        </View>
      ) : null}

      {explanation ? (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationText}>💡 {explanation}</Text>
        </View>
      ) : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: '#FAF7F2',
    borderColor: BRAND_COLORS.primaryLight + '30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: BRAND_COLORS.primary,
  },
  section: {
    marginBottom: SPACING.xs,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#766D70',
  },
  originalText: {
    fontSize: FONT_SIZES.sm,
    color: '#6D4C5B',
    fontStyle: 'italic',
  },
  simplifiedText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#302B2D',
    marginTop: 2,
  },
  explanationBox: {
    marginTop: SPACING.xs,
    padding: SPACING.xs,
    backgroundColor: BRAND_COLORS.primaryLight + '10',
    borderRadius: BORDER_RADIUS.xs,
  },
  explanationText: {
    fontSize: FONT_SIZES.xs,
    color: BRAND_COLORS.primaryDark,
  },
});

export default MessageExplanation;
