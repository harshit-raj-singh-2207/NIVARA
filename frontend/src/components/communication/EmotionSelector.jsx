/**
 * EmotionSelector.jsx
 * Interactive emotion selector for AI emotion-aware sentence generation.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const EMOTION_OPTIONS = [
  { id: 'calm', label: 'Calm', icon: '🧘', color: '#6F9674' },
  { id: 'happy', label: 'Happy', icon: '😊', color: '#8FA58A' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: '😟', color: '#D5A45A' },
  { id: 'anxious', label: 'Anxious', icon: '😨', color: '#6D4C5B' },
  { id: 'frustrated', label: 'Frustrated', icon: '😡', color: '#C76B67' },
  { id: 'tired', label: 'Tired', icon: '😴', color: '#766D70' },
];

export const EmotionSelector = ({ selectedEmotion = 'calm', onSelectEmotion, style }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {EMOTION_OPTIONS.map((item) => {
          const isSelected = selectedEmotion === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectEmotion && onSelectEmotion(item.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? item.color : colors.surfaceSubtle,
                  borderColor: isSelected ? item.color : colors.border,
                  borderRadius: borderRadius.lg,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginRight: 8,
                  ...shadows.small,
                },
              ]}
            >
              <Text style={{ fontSize: 18, marginRight: 6 }}>{item.icon}</Text>
              <Text
                style={{
                  color: isSelected ? '#FFFFFF' : colors.text,
                  fontSize: typography.sizes.xs,
                  fontWeight: isSelected ? typography.weights.bold : typography.weights.medium,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default EmotionSelector;
