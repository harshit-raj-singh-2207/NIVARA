/**
 * CommunityFilter.jsx
 * Topic filter horizontal scroll chips for community feed.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const DEFAULT_COMMUNITY_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'sensory', label: 'Sensory Tips' },
  { id: 'aac', label: 'AAC Strategies' },
  { id: 'caregiver', label: 'Caregiver Support' },
  { id: 'routines', label: 'Daily Routines' },
];

export const CommunityFilter = ({
  categories = DEFAULT_COMMUNITY_CATEGORIES,
  selectedCategory = 'all',
  onSelectCategory,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectCategory && onSelectCategory(item.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderRadius: borderRadius.full,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginRight: 8,
                },
              ]}
            >
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
    borderWidth: 1,
  },
});

export default CommunityFilter;
