import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';

/**
 * Reusable App Header.
 * Features a title, optional back button, and optional right-side icon button.
 * 
 * @param {Object} props
 * @param {string} props.title - Main header title
 * @param {boolean} [props.showBack=false] - Whether to render a back button
 * @param {Function} [props.onBack] - Override default back navigation behavior
 * @param {string} [props.rightIcon] - Ionicons name for right button
 * @param {Function} [props.onRightPress] - Action for right button
 */
const AppHeader = ({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Area: Back Button or Placeholder */}
      <View style={styles.sideContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={lightTheme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Area: Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right Area: Action Icon or Placeholder */}
      <View style={styles.sideContainer}>
        {rightIcon && (
          <TouchableOpacity
            style={[styles.iconButton, styles.rightButton]}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={24} color={lightTheme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: lightTheme.spacing.md,
    backgroundColor: lightTheme.colors.background,
  },
  sideContainer: {
    width: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: lightTheme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.colors.surface,
    ...lightTheme.shadows.sm,
  },
  rightButton: {
    alignSelf: 'flex-end',
  },
});

export default AppHeader;
