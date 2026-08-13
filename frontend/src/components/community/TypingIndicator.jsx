/**
 * TypingIndicator.jsx
 * Visual animated typing indicator for active chat screen.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES } from '../../constants/typography';

export const TypingIndicator = ({ username = 'Someone' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{username} is typing...</Text>
      <View style={styles.dotContainer}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
    fontStyle: 'italic',
    marginRight: SPACING.xs,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: BRAND_COLORS.primary,
    marginHorizontal: 1,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1.0 },
});

export default TypingIndicator;
