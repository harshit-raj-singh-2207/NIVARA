/**
 * EmergencyCard.jsx
 * Urgent emergency panic alert banner card with status indicators and quick dispatch controls.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppCard from '../common/AppCard';
import { STATUS_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const EmergencyCard = ({ alert, onResolve, onCancel }) => {
  if (!alert) return null;

  const { title, message, location, timestamp } = alert;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🚨</Text>
        <Text style={styles.title}>{title || 'EMERGENCY ALERT'}</Text>
      </View>

      <Text style={styles.message}>{message}</Text>

      {location ? (
        <View style={styles.locationRow}>
          <Text style={styles.locIcon}>📍</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        {onCancel ? (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>Dismiss</Text>
          </TouchableOpacity>
        ) : null}

        {onResolve ? (
          <TouchableOpacity style={styles.resolveBtn} onPress={onResolve} activeOpacity={0.8}>
            <Text style={styles.resolveBtnText}>Mark Resolved</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: STATUS_COLORS.errorBackground,
    borderColor: STATUS_COLORS.error,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 22,
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: STATUS_COLORS.error,
  },
  message: {
    fontSize: FONT_SIZES.sm,
    color: '#7F1D1D',
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#991B1B',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#FFFFFF',
    marginRight: SPACING.xs,
  },
  cancelBtnText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#475569',
  },
  resolveBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: STATUS_COLORS.error,
  },
  resolveBtnText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
});

export default EmergencyCard;
