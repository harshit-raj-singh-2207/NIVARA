/**
 * PreferenceCard.jsx
 * Remote sensory preference control card for caregivers.
 */

import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const PreferenceCard = ({ title, description, value, onValueChange, icon = '⚙️' }) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#CBD5E1', true: BRAND_COLORS.primaryLight }}
          thumbColor={value ? BRAND_COLORS.primary : '#F8FAFC'}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: BRAND_COLORS.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#0F172A',
  },
  description: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
    marginTop: 2,
  },
});

export default PreferenceCard;
