
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import textToSpeech from '../../services/audio/textToSpeech';
import { useTheme } from '../../theme';

export const SpeechButton = ({ text, onPress, size = 'medium', disabled = false, style }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => textToSpeech.stop(), []);

  const handleSpeak = async () => {
    if (!text && !onPress) return;
    if (onPress) {
      await onPress(text);
      return;
    }
    if (speaking) {
      textToSpeech.stop();
      setSpeaking(false);
      return;
    }
    try {
      await textToSpeech.speak(text, {
        onStart: () => setSpeaking(true),
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => {
          setSpeaking(false);
          Alert.alert('Speech unavailable', 'Check your device audio and speech settings, then try again.');
        },
      });
    } catch (error) {
      setSpeaking(false);
    }
  };

  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const unavailable = disabled || (!text && !onPress);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={unavailable}
      onPress={handleSpeak}
      accessibilityRole="button"
      accessibilityLabel={speaking ? 'Stop speaking' : 'Speak message aloud'}
      style={[styles.container, {
        backgroundColor: speaking ? colors.status.success : colors.primary,
        borderRadius: borderRadius.full,
        paddingHorizontal: isSmall ? 10 : isLarge ? 18 : 14,
        paddingVertical: isSmall ? 6 : isLarge ? 12 : 8,
        opacity: unavailable ? 0.5 : 1,
      }, style]}
    >
      <Text style={{ fontSize: isSmall ? 14 : isLarge ? 20 : 16, marginRight: 6 }}>{speaking ? '■' : '🔊'}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: isSmall ? typography.sizes.xs : typography.sizes.sm, fontWeight: typography.weights.bold }}>
        {speaking ? 'Stop' : 'Speak'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export default SpeechButton;
