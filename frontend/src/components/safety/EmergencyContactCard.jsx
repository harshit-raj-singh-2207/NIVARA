import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AppCard from '../common/AppCard';
import { lightTheme } from '../../theme/lightTheme';

const EmergencyContactCard = ({ name, role, onCall }) => {
  return (
    <AppCard style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
        <Pressable style={styles.callButton} onPress={onCall}>
          <Text style={styles.callIcon}>📞</Text>
        </Pressable>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: lightTheme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  avatarText: {
    color: lightTheme.colors.primaryDark,
    fontWeight: lightTheme.typography.weight.bold,
    fontSize: lightTheme.typography.size.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: lightTheme.typography.size.md,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
  },
  role: {
    fontSize: lightTheme.typography.size.xs,
    color: lightTheme.colors.text.secondary,
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 20,
  }
});

export default EmergencyContactCard;
