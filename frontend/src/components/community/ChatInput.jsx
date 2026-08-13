/**
 * ChatInput.jsx
 * Chat message input toolbar with text input, attachment trigger, and send button.
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import AttachmentButton from './AttachmentButton';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES } from '../../constants/typography';

export const ChatInput = ({ onSend, onAttach }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <AttachmentButton onPress={onAttach} />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#94A3B8"
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.sendIcon}>🚀</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: '#0F172A',
    marginRight: SPACING.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: BRAND_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    fontSize: 18,
  },
});

export default ChatInput;
