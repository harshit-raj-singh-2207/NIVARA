/**
 * CommunicationCard.jsx
 * Display card for AAC boards, custom phrases, or AI sentence suggestions.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const CommunicationCard = ({ title, icon, subtitle, onPress, actionLabel }) => {
  return (
    <AppCard style={styles.card}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon || '💬'}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {actionLabel ? (
          <View style={styles.actionBadge}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </View>
        ) : null}
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#302B2D',
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: '#766D70',
    marginTop: 2,
  },
  actionBadge: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
});

export default CommunicationCard;
