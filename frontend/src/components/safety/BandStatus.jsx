import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppCard from '../common/AppCard';
import { lightTheme } from '../../theme/lightTheme';

const BandStatus = ({ isConnected, batteryLevel }) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>GPS Band Status</Text>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
        </View>
        {isConnected && (
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>{batteryLevel}%</Text>
          </View>
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: lightTheme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: lightTheme.typography.size.sm,
    color: lightTheme.colors.text.secondary,
    fontWeight: lightTheme.typography.weight.medium,
    marginBottom: lightTheme.spacing.xs,
  },
  statusText: {
    fontSize: lightTheme.typography.size.md,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
  },
  batteryContainer: {
    backgroundColor: lightTheme.colors.status.safeBg,
    paddingHorizontal: lightTheme.spacing.sm,
    paddingVertical: lightTheme.spacing.xs,
    borderRadius: lightTheme.borderRadius.sm,
  },
  batteryText: {
    color: lightTheme.colors.status.safe,
    fontWeight: lightTheme.typography.weight.bold,
  }
});

export default BandStatus;
