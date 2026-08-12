/**
 * ContactCard.jsx
 * Caregiver contact card component displaying emergency contact details and quick call action.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS, STATUS_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const ContactCard = ({ contact, onCall, onEdit }) => {
  if (!contact) return null;

  const { name, phone, relationship, isPrimary } = contact;

  const handleCall = () => {
    if (onCall) {
      onCall(contact);
    } else if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : '👤'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{name}</Text>
            {isPrimary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>Primary</Text>
              </View>
            )}
          </View>
          <Text style={styles.relationship}>{relationship || 'Emergency Contact'}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.8}>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: BRAND_COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: BRAND_COLORS.primary,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
    marginRight: SPACING.xs,
  },
  primaryBadge: {
    backgroundColor: STATUS_COLORS.warningBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
    color: STATUS_COLORS.warning,
  },
  relationship: {
    fontSize: FONT_SIZES.sm,
    color: '#64748B',
    marginTop: 2,
  },
  phone: {
    fontSize: FONT_SIZES.xs,
    color: BRAND_COLORS.primary,
    marginTop: 2,
    fontWeight: FONT_WEIGHTS.medium,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: STATUS_COLORS.successBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  callIcon: {
    fontSize: 18,
  },
});

export default ContactCard;
