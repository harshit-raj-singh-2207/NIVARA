/**
 * Accessible Reusable Confirmation Modal Dialog for NIVARA.
 * Wraps Modal component for clear confirmation workflows (e.g. SOS Panic Alert triggers).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from './Modal';
import { useTheme } from '../../theme';

export const ConfirmModal = ({
  visible = false,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  return (
    <Modal
      visible={visible}
      onClose={onCancel}
      title={title}
      primaryAction={{
        title: confirmText,
        onPress: onConfirm,
      }}
      secondaryAction={{
        title: cancelText,
        onPress: onCancel,
      }}
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.message,
            {
              color: colors.text,
              fontSize: typography.sizes.md,
              marginVertical: spacing.sm,
            },
          ]}
        >
          {message}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  message: {
    lineHeight: 22,
  },
});

export default ConfirmModal;
