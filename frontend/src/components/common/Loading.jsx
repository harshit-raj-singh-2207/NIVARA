import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../../theme';

/**
 * Reusable Loading indicator.
 * Supports a full-screen overlay mode or a local inline center mode.
 * 
 * @param {Object} props
 * @param {boolean} [props.fullScreen=false] - If true, covers the entire parent via absolute positioning
 * @param {string} [props.message] - Optional text to display under the spinner
 * @param {string} [props.size='large'] - 'small' or 'large' (React Native ActivityIndicator size)
 * @param {string} [props.color=lightTheme.colors.primary] - Custom color for the spinner
 */
const Loading = ({
  fullScreen = false,
  message,
  size = 'large',
  color = lightTheme.colors.primary
}) => {
  return (
    <View style={fullScreen ? styles.fullScreenContainer : styles.localContainer}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={styles.messageText}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  localContainer: {
    padding: lightTheme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Will expand to fill local flex parent
  },
  messageText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginTop: lightTheme.spacing.md,
    textAlign: 'center',
  },
});

export default Loading;
