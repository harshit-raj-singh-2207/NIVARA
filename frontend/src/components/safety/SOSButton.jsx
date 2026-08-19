import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { lightTheme } from '../../theme/lightTheme';

const SOSButton = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onLongPress={onPress}
        delayLongPress={1500}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <Text style={styles.text}>SOS</Text>
      </Pressable>
      <Text style={[styles.helpText, { opacity: isPressed ? 1 : 0 }]}>
        Hold for 1.5 seconds
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: lightTheme.spacing.xxl,
  },
  button: {
    backgroundColor: lightTheme.colors.status.emergency,
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    ...lightTheme.shadows.md,
    borderWidth: 6,
    borderColor: lightTheme.colors.status.emergencyBg,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#dc2626',
  },
  text: {
    color: lightTheme.colors.text.inverse,
    fontSize: lightTheme.typography.size.xxxl,
    fontWeight: lightTheme.typography.weight.bold,
  },
  helpText: {
    marginTop: lightTheme.spacing.md,
    color: lightTheme.colors.status.emergency,
    fontSize: lightTheme.typography.size.sm,
    fontWeight: lightTheme.typography.weight.medium,
  }
});

export default SOSButton;
