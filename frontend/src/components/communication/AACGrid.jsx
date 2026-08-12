/**
 * AACGrid.jsx
 * Picture and icon-based AAC Symbol grid component for non-verbal communication.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const DEFAULT_AAC_SYMBOLS = [
  { id: 'water', label: 'I want water', icon: '💧', category: 'Needs' },
  { id: 'food', label: 'I am hungry', icon: '🍎', category: 'Needs' },
  { id: 'rest', label: 'I need rest', icon: '🛏️', category: 'Needs' },
  { id: 'quiet', label: 'Too loud / Quiet', icon: '🎧', category: 'Sensory' },
  { id: 'bathroom', label: 'Use bathroom', icon: '🚻', category: 'Needs' },
  { id: 'break', label: 'Take a break', icon: '⏸️', category: 'Sensory' },
  { id: 'happy', label: 'I feel good', icon: '😊', category: 'Emotions' },
  { id: 'help', label: 'Please help me', icon: '🆘', category: 'Emergency' },
];

export const AACGrid = ({ symbols = DEFAULT_AAC_SYMBOLS, onSelectSymbol, columns = 4 }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  return (
    <View style={styles.gridContainer}>
      {symbols.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.8}
          onPress={() => onSelectSymbol && onSelectSymbol(item)}
          style={[
            styles.symbolTile,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: 8,
              ...shadows.small,
            },
          ]}
        >
          <Text style={{ fontSize: 26, marginBottom: 4 }}>{item.icon}</Text>
          <Text
            numberOfLines={2}
            style={{
              color: colors.text,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.bold,
              textAlign: 'center',
            }}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  symbolTile: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 75,
  },
});

export default AACGrid;
