import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';

/**
 * Reusable textured text input component.
 * 
 * @param {Object} props 
 * @param {string} [props.label] - Top label for the input
 * @param {string} [props.error] - Error message string (turns borders red when present)
 * @param {string} [props.icon] - Ionicons name to show on the left
 * @param {boolean} [props.secureTextEntry=false] - For passwords
 * @param {boolean} [props.multiline=false] - For text areas
 * @param {import('react-native').TextInputProps} props - All standard TextInput props
 */
const AppInput = ({
  label,
  error,
  icon,
  secureTextEntry = false,
  multiline = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Dynamic styling based on state
  const isError = !!error;
  const borderColor = isError 
    ? lightTheme.colors.status.emergency 
    : isFocused 
      ? lightTheme.colors.primary 
      : lightTheme.colors.border;

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, isError && styles.labelError]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View 
        style={[
          styles.inputContainer, 
          { borderColor },
          multiline && styles.multilineContainer
        ]}
      >
        {/* Left Icon (Optional) */}
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? lightTheme.colors.primary : lightTheme.colors.text.secondary} 
            style={styles.leftIcon}
          />
        )}

        {/* Core Input */}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            icon && styles.inputWithLeftIcon
          ]}
          placeholderTextColor={lightTheme.colors.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />

        {/* Right Icon for Passwords */}
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color={lightTheme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {isError && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: lightTheme.spacing.md,
  },
  label: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.xs,
    fontWeight: '500',
  },
  labelError: {
    color: lightTheme.colors.status.emergency,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    borderWidth: 1.5,
    borderRadius: lightTheme.borderRadius.md,
    minHeight: 52,
  },
  multilineContainer: {
    minHeight: 120,
    alignItems: 'flex-start',
    paddingVertical: lightTheme.spacing.sm,
  },
  leftIcon: {
    paddingLeft: lightTheme.spacing.md,
  },
  input: {
    flex: 1,
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.primary,
    paddingHorizontal: lightTheme.spacing.md,
    height: '100%',
  },
  inputWithLeftIcon: {
    paddingLeft: lightTheme.spacing.sm,
  },
  multilineInput: {
    minHeight: 100,
  },
  eyeIcon: {
    padding: lightTheme.spacing.md,
  },
  errorText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.status.emergency,
    marginTop: lightTheme.spacing.xs,
  },
});

export default AppInput;
