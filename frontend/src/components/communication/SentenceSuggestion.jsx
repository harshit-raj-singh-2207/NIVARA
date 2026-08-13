/**
 * SentenceSuggestion.jsx
 * AI-generated sentence suggestions display component.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import SpeechButton from './SpeechButton';

export const SentenceSuggestion = ({ suggestions = [], onSelectSuggestion, onSpeak }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.bold,
          marginBottom: 8,
        }}
      >
        ✨ AI Suggested Sentences:
      </Text>

      {suggestions.map((item, index) => {
        const textVal = typeof item === 'string' ? item : item.text || item.sentence;
        return (
          <View
            key={index}
            style={[
              styles.suggestionCard,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.primaryLight,
                borderRadius: borderRadius.md,
                padding: 10,
                marginBottom: 8,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectSuggestion && onSelectSuggestion(textVal)}
              style={{ flex: 1, marginRight: 8 }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  lineHeight: 20,
                }}
              >
                "{textVal}"
              </Text>
            </TouchableOpacity>

            <SpeechButton text={textVal} size="small" onPress={onSpeak} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
});

export default SentenceSuggestion;
