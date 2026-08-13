/**
 * ResponseSuggestion.jsx
 * Social response suggestion chips component based on interpreted social cues.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const ResponseSuggestion = ({ suggestions = [], onSelectResponse }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.bold,
          marginBottom: 6,
        }}
      >
        💡 Suggested Social Responses:
      </Text>

      <View style={styles.chipsContainer}>
        {suggestions.map((textItem, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.8}
            onPress={() => onSelectResponse && onSelectResponse(textItem)}
            style={[
              styles.chip,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
                paddingVertical: 6,
                paddingHorizontal: 12,
                marginBottom: 6,
              },
            ]}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
              }}
            >
              💬 "{textItem}"
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'column',
  },
  chip: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});

export default ResponseSuggestion;
