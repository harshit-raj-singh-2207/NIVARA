import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppButton from './AppButton';

/**
 * Reusable Confirmation Modal.
 * Used for destructive actions (e.g., deleting a Safe Zone, resolving an SOS).
 *
 * @param {Object} props
 * @param {boolean} props.visible - Modal visibility state
 * @param {Function} props.onClose - Action when dismissed
 * @param {Function} props.onConfirm - Action when confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Descriptive text explaining the action
 * @param {string} [props.confirmText='Confirm'] - Label for the primary button
 * @param {string} [props.cancelText='Cancel'] - Label for the secondary button
 * @param {boolean} [props.isDestructive=false] - If true, colors the confirm button Red
 * @param {boolean} [props.isLoading=false] - If true, shows a spinner on the confirm button
 * @param {string} [props.icon] - Optional Ionicons name to show at the top
 */
const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  icon,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={isLoading ? undefined : onClose}
    >
      {/* Background Overlay */}
      <View style={styles.overlay}>
        {/* Modal Container */}
        <View style={styles.modalContainer}>
          
          {/* Top Right Close X */}
          {!isLoading && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={lightTheme.colors.text.secondary} />
            </TouchableOpacity>
          )}

          {/* Optional Icon Header */}
          {icon && (
            <View style={[
              styles.iconWrapper, 
              isDestructive ? styles.iconWrapperDestructive : {}
            ]}>
              <Ionicons 
                name={icon} 
                size={32} 
                color={isDestructive ? lightTheme.colors.status.emergency : lightTheme.colors.primary} 
              />
            </View>
          )}

          {/* Text Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.actionContainer}>
            <View style={styles.buttonWrapper}>
              <AppButton
                title={cancelText}
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
              />
            </View>
            
            {/* Gap */}
            <View style={{ width: lightTheme.spacing.md }} />
            
            <View style={styles.buttonWrapper}>
              <AppButton
                title={confirmText}
                variant={isDestructive ? 'danger' : 'primary'}
                onPress={onConfirm}
                isLoading={isLoading}
              />
            </View>
          </View>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: lightTheme.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.xl,
    alignItems: 'center',
    ...lightTheme.shadows.md,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: lightTheme.spacing.md,
    right: lightTheme.spacing.md,
    padding: lightTheme.spacing.xs,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: lightTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.lg,
  },
  iconWrapperDestructive: {
    backgroundColor: lightTheme.colors.status.emergencyBg,
  },
  title: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  message: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.xl,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default ConfirmModal;
