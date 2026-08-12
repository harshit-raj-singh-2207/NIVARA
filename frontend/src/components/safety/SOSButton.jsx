/**
 * SOSButton.jsx
 * Emergency SOS Panic Trigger button with press and hold-to-confirm mechanism.
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { STATUS_COLORS } from '../../constants/colors';

export const SOSButton = ({ onPress, onHoldConfirm, isTriggered = false }) => {
  const { theme } = useTheme();
  const { borderRadius, typography, shadows } = theme;

  const [pressing, setPressing] = useState(false);

  const handlePressIn = () => {
    setPressing(true);
  };

  const handlePressOut = () => {
    setPressing(false);
  };

  const handlePress = () => {
    Alert.alert(
      '🚨 Trigger Emergency SOS?',
      'Hold the button for 2 seconds or tap Confirm to dispatch panic alerts to all linked caregivers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'CONFIRM SOS',
          style: 'destructive',
          onPress: () => (onHoldConfirm ? onHoldConfirm() : onPress ? onPress() : null),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.sosCircle,
          {
            backgroundColor: isTriggered ? STATUS_COLORS.error : '#DC2626',
            borderRadius: 75,
            ...shadows.large,
            transform: [{ scale: pressing ? 0.96 : 1 }],
          },
        ]}
      >
        <Text style={styles.sosEmoji}>🚨</Text>
        <Text style={styles.sosText}>EMERGENCY</Text>
        <Text style={styles.sosSubtext}>HOLD FOR SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  sosCircle: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 8,
  },
  sosEmoji: {
    fontSize: 32,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },
  sosSubtext: {
    color: '#FEE2E2',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default SOSButton;
