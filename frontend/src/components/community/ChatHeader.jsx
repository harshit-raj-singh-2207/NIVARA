/**
 * ChatHeader.jsx
 * Top header component for chat conversations showing avatar, name, and online status.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Avatar from '../common/Avatar';
import OnlineIndicator from './OnlineIndicator';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const ChatHeader = ({ title, avatar, isOnline, onBackPress, onProfilePress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
        <Text style={styles.backIcon}>⬅️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoRow} onPress={onProfilePress} activeOpacity={0.8}>
        <View style={styles.avatarWrapper}>
          <Avatar size="sm" source={avatar} name={title} />
          <OnlineIndicator isOnline={isOnline} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  backIcon: {
    fontSize: 20,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
  },
});

export default ChatHeader;
