/**
 * AACButton.jsx
 * Individual touch-friendly AAC symbol button with speech audio trigger.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AAC_BUTTON_COLORS, BRAND_COLORS, PALETTE } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const AACButton = ({ item, onPress, selected = false }) => {
  if (!item) return null;

  const { label, symbol, category } = item;

  let backgroundColor = PALETTE.neutral.surfaceLight;
  let borderColor = PALETTE.neutral.border;

  if (category === 'urgent') {
    backgroundColor = AAC_BUTTON_COLORS.needHelp + '15';
    borderColor = AAC_BUTTON_COLORS.needHelp;
  } else if (category === 'sensory') {
    backgroundColor = AAC_BUTTON_COLORS.needSpace + '15';
    borderColor = AAC_BUTTON_COLORS.needSpace;
  } else if (category === 'response') {
    backgroundColor = AAC_BUTTON_COLORS.yes + '15';
    borderColor = AAC_BUTTON_COLORS.yes;
  }

  if (selected) {
    borderColor = BRAND_COLORS.primary;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor },
        selected && styles.selectedButton,
      ]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.symbol}>{symbol || '💬'}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    aspectRatio: 1,
    minHeight: 90,
    margin: SPACING.xs,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#6D5B62',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  selectedButton: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  symbol: {
    fontSize: 32,
    marginBottom: 4,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: PALETTE.neutral.textPrimary,
    textAlign: 'center',
  },
});

export default AACButton;
