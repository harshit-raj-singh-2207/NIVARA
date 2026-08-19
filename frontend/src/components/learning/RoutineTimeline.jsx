/**
 * RoutineTimeline.jsx
 * Daily routine timeline breakdown component (Morning, Afternoon, Evening).
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const RoutineTimeline = ({ routines = [], activeRoutineId, onSelectRoutine }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {routines.map((item) => {
          const isActive = activeRoutineId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectRoutine && onSelectRoutine(item.id)}
              style={[
                styles.card,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceSubtle,
                  borderColor: isActive ? colors.primary : colors.border,
                  borderRadius: borderRadius.lg,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  marginRight: 8,
                  ...shadows.small,
                },
              ]}
            >
              <Text style={{ fontSize: 20, marginBottom: 2 }}>{item.icon || '🌅'}</Text>
              <Text
                style={{
                  color: isActive ? '#FFFFFF' : colors.text,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.bold,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  color: isActive ? '#F5EFF2' : colors.textMuted,
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                {item.time}
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
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 110,
  },
});

export default RoutineTimeline;
