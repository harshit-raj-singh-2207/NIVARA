/**
 * SensoryPreference.jsx
 * Sensory sensitivity preferences card (noise threshold dB, brightness lux, theme mode controls).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppCard from '../common/AppCard';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const SensoryPreference = ({ noiseDb = 85, brightnessLux = 800, themeMode = 'light' }) => {
  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>Sensory Sensitivity Profile</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Max Noise Threshold:</Text>
        <Text style={styles.value}>{noiseDb} dB</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Max Light Brightness:</Text>
        <Text style={styles.value}>{brightnessLux} Lux</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Theme Palette:</Text>
        <Text style={styles.value}>{themeMode.toUpperCase()}</Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: '#64748B',
  },
  value: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: BRAND_COLORS.primary,
  },
});

export default SensoryPreference;
