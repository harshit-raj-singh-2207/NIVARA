/**
 * MessageStatus.jsx
 * Message delivery/read status indicator checkmarks for chat.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../../constants/colors';

export const MessageStatus = ({ status = 'sent' }) => {
  let icon = '✓';
  let color = '#94A3B8';

  if (status === 'delivered') {
    icon = '✓✓';
    color = '#94A3B8';
  } else if (status === 'read') {
    icon = '✓✓';
    color = BRAND_COLORS.primary;
  }

  return <Text style={[styles.statusText, { color }]}>{icon}</Text>;
};

const styles = StyleSheet.create({
  statusText: {
    fontSize: 10,
    marginLeft: 4,
  },
});

export default MessageStatus;
