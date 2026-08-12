/**
 * SafeZoneMarker.jsx
 * Safe Zone geofence marker badge component.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STATUS_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const SafeZoneMarker = ({ name, isInside = true }) => {
  return (
    <View style={[styles.badge, isInside ? styles.insideBadge : styles.outsideBadge]}>
      <Text style={styles.icon}>{isInside ? '🛡️' : '⚠️'}</Text>
      <Text style={[styles.text, isInside ? styles.insideText : styles.outsideText]}>
        {name || 'Geofence Zone'}: {isInside ? 'Inside Safe Zone' : 'Outside Boundary'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  insideBadge: {
    backgroundColor: STATUS_COLORS.successBackground,
  },
  outsideBadge: {
    backgroundColor: STATUS_COLORS.warningBackground,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  insideText: {
    color: STATUS_COLORS.success,
  },
  outsideText: {
    color: STATUS_COLORS.warning,
  },
});

export default SafeZoneMarker;
