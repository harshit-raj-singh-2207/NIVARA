/**
 * CaregiverHeader.jsx
 * Header component with linked dependent child selector tab bar.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';

export const CaregiverHeader = ({
  dependents = [],
  activeDependentId,
  onSelectDependent,
  caregiverName = 'Caregiver Dashboard',
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            CAREGIVER HUB
          </Text>
          <Text style={{ color: colors.text, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold }}>
            {caregiverName}
          </Text>
        </View>
      </View>

      {/* Linked Dependents Horizontal Selector Pills */}
      {dependents.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {dependents.map((child) => {
            const isSelected = activeDependentId === child.id;
            return (
              <TouchableOpacity
                key={child.id}
                activeOpacity={0.8}
                onPress={() => onSelectDependent && onSelectDependent(child.id)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    ...shadows.small,
                  },
                ]}
              >
                <Text style={{ fontSize: 16, marginRight: 6 }}>{child.avatar || '👦'}</Text>
                <Text
                  style={{
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontSize: typography.sizes.xs,
                    fontWeight: isSelected ? typography.weights.bold : typography.weights.medium,
                  }}
                >
                  {child.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default CaregiverHeader;
