/**
 * AttachmentButton.jsx
 * Media attachment trigger button for picking photos/documents in chat.
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BRAND_COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing';

export const AttachmentButton = ({ onPress, icon = '📎' }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  icon: {
    fontSize: 18,
  },
});

export default AttachmentButton;
