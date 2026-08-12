/**
 * GroupListItem.jsx
 * Group item row for group discovery and directory listing.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const GroupListItem = ({ group, isJoined, onToggleJoin, onPress }) => {
  if (!group) return null;

  const { name, icon, category, memberCount, description } = group;

  return (
    <AppCard style={styles.card}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon || '👥'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category} • {memberCount || 1} members</Text>
          {description ? <Text style={styles.description} numberOfLines={2}>{description}</Text> : null}
        </View>
        <TouchableOpacity
          style={[styles.joinBtn, isJoined && styles.joinedBtn]}
          onPress={() => onToggleJoin && onToggleJoin(group.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.joinBtnText, isJoined && styles.joinedBtnText]}>
            {isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
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
    justify.content: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
    marginTop: 2,
  },
  description: {
    fontSize: FONT_SIZES.xs,
    color: '#475569',
    marginTop: 4,
  },
  joinBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
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
});

export default GroupListItem;
