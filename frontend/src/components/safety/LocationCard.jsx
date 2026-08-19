import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppCard from '../common/AppCard';
import { lightTheme } from '../../theme/lightTheme';

const LocationCard = ({ address, isTracking }) => {
  return (
    <AppCard>
      <View style={styles.header}>
        <Text style={styles.title}>Current Location</Text>
        {isTracking && <Text style={styles.badge}>Live tracking on</Text>}
      </View>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View Placeholder</Text>
      </View>
      <Text style={styles.address}>{address}</Text>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  title: {
    fontSize: lightTheme.typography.size.md,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
  },
  badge: {
    fontSize: lightTheme.typography.size.xs,
    color: lightTheme.colors.status.safe,
    backgroundColor: lightTheme.colors.status.safeBg,
    paddingHorizontal: lightTheme.spacing.sm,
    paddingVertical: lightTheme.spacing.xs,
    borderRadius: lightTheme.borderRadius.round,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: lightTheme.colors.background,
    borderRadius: lightTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  mapText: {
    color: lightTheme.colors.text.secondary,
    fontWeight: lightTheme.typography.weight.medium,
  },
  address: {
    fontSize: lightTheme.typography.size.sm,
    color: lightTheme.colors.text.secondary,
  }
});

export default LocationCard;
