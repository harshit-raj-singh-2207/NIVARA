/**
 * MemberItem.jsx
 * Community group or chat member list item row.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Avatar from '../common/Avatar';
import OnlineIndicator from './OnlineIndicator';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const MemberItem = ({ member, onPress }) => {
  if (!member) return null;

  const { name, role, isOnline, avatar } = member;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatarWrapper}>
        <Avatar size="sm" name={name} source={avatar} />
        <OnlineIndicator isOnline={isOnline} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {role ? <Text style={styles.role}>{role}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#0F172A',
  },
  role: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
  },
});

export default MemberItem;
