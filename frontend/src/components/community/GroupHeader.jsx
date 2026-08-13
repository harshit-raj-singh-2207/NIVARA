/**
 * GroupHeader.jsx
 * Header card displaying community group metadata, title, icon, and member count.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const GroupHeader = ({ group, isJoined, onToggleJoin }) => {
  if (!group) return null;

  const { name, icon, description, memberCount } = group;

  return (
    <AppCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon || '👥'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.memberCount}>{memberCount || 1} Members</Text>
        </View>
        <TouchableOpacity
          style={[styles.joinBtn, isJoined && styles.joinedBtn]}
          onPress={onToggleJoin}
          activeOpacity={0.8}
        >
          <Text style={[styles.joinBtnText, isJoined && styles.joinedBtnText]}>
            {isJoined ? 'Joined' : '+ Join'}
          </Text>
        </TouchableOpacity>
      </View>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: BRAND_COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
  },
  memberCount: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
    marginTop: 2,
  },
  joinBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: BRAND_COLORS.primary,
  },
  joinedBtn: {
    backgroundColor: '#F1F5F9',
  },
  joinBtnText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  joinedBtnText: {
    color: '#475569',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: '#334155',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
});

export default GroupHeader;
