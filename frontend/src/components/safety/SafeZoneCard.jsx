import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppCard from '../common/AppCard';
import { lightTheme } from '../../theme/lightTheme';

const SafeZoneCard = ({ currentZone, status }) => {
  const isSafe = status === 'safe';
  return (
    <AppCard>
      <Text style={styles.title}>Safe Zones</Text>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isSafe ? '📍' : '⚠️'}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.status}>
            {isSafe ? 'You are inside a Safe Zone' : 'You have left the Safe Zone'}
          </Text>
          <Text style={styles.zoneName}>{currentZone}</Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: lightTheme.typography.size.md,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
    marginBottom: lightTheme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: lightTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  status: {
    fontSize: lightTheme.typography.size.sm,
    color: lightTheme.colors.text.secondary,
    marginBottom: lightTheme.spacing.xs,
  },
  zoneName: {
    fontSize: lightTheme.typography.size.md,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
  }
});

export default SafeZoneCard;
