import React from 'react';
import { View, StyleSheet } from 'react-native';
import { lightTheme } from '../../theme/lightTheme';

const AppCard = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.md,
    ...lightTheme.shadows.sm,
  },
});

export default AppCard;
