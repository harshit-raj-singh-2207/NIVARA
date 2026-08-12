/**
 * SocialCueCard.jsx
 * Social cue interpretation assistant card component for breaking down social cues & tone of voice.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const SocialCueCard = ({ cue, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!cue) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.primaryLight,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 10,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 24, marginRight: 8 }}>{cue.icon || '🧠'}</Text>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
            }}
          >
            {cue.title || 'Social Tone Interpretation'}
          </Text>

          <Text style={{ color: colors.primary, fontSize: typography.sizes.xs, fontWeight: 'bold', marginTop: 2 }}>
            Tone: {cue.tone || 'Friendly & Casual'} • Emotion: {cue.emotion || 'Warm'}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.sizes.xs,
          marginTop: 8,
          lineHeight: 18,
        }}
      >
        👀 Body Language Cue: {cue.bodyLanguage || 'Making soft eye contact and smiling.'}
      </Text>

      {cue.context && (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: typography.sizes.xs,
            marginTop: 4,
            fontStyle: 'italic',
          }}
        >
          Context: {cue.context}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SocialCueCard;
