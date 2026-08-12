/**
 * SpeechButton.jsx
 * Text-to-Speech (TTS) speaker button for reading sentences aloud.
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

export const SpeechButton = ({
  text,
  onPress,
  size = 'medium',
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text && !onPress) return;

    if (onPress) {
      onPress(text);
      return;
    }

    setSpeaking(true);
    // Simulate Text-to-Speech synthesis output
    Alert.alert('🔊 Text-to-Speech Synthesis', `Speaking aloud: "${text}"`, [
      { text: 'Stop Speech', onPress: () => setSpeaking(false) },
    ]);
    setTimeout(() => setSpeaking(false), 2000);
  };

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || (!text && !onPress)}
      onPress={handleSpeak}
      style={[
        styles.container,
        {
          backgroundColor: speaking ? colors.status.success : colors.primary,
          borderRadius: borderRadius.full,
          paddingHorizontal: isSmall ? 10 : isLarge ? 18 : 14,
          paddingVertical: isSmall ? 6 : isLarge ? 12 : 8,
          opacity: disabled || (!text && !onPress) ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: isSmall ? 14 : isLarge ? 20 : 16, marginRight: 6 }}>
        {speaking ? '📢' : '🔊'}
      </Text>
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: isSmall ? typography.sizes.xs : typography.sizes.sm,
          fontWeight: typography.weights.bold,
        }}
      >
        {speaking ? 'Speaking...' : 'Speak'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpeechButton;
