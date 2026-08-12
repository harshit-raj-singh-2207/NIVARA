/**
 * Accessible Reusable Modal Dialog Component for NIVARA.
 * Supports sensory-friendly backdrop overlays, clean animations, accessibility attributes, and action buttons.
 */

import React from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../theme';

export const Modal = ({
  visible = false,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  animationType = 'fade',
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, typography } = theme;

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
      accessibilityLabel={accessibilityLabel || title || 'Dialog window'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                },
                style,
              ]}
            >
              {/* Header / Title */}
              <View style={styles.headerRow}>
                {title ? (
                  <Text
                    style={[
                      styles.title,
                      {
                        color: colors.text,
                        fontSize: typography.sizes.lg,
                        fontWeight: typography.weights.bold,
                        marginBottom: spacing.sm,
                      },
                    ]}
                  >
                    {title}
                  </Text>
                ) : null}

                {onClose && (
                  <TouchableOpacity
                    onPress={onClose}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Close dialog"
                    style={styles.closeButton}
                  >
                    <Text style={[styles.closeIcon, { color: colors.textMuted }]}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Body */}
              <View style={[styles.body, { marginVertical: spacing.sm }]}>{children}</View>

              {/* Action Buttons */}
              {(primaryAction || secondaryAction) && (
                <View style={[styles.actionRow, { marginTop: spacing.md }]}>
                  {secondaryAction && (
                    <TouchableOpacity
                      onPress={secondaryAction.onPress}
                      style={[
                        styles.actionButton,
                        styles.secondaryButton,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderRadius: borderRadius.md,
                          paddingVertical: spacing.sm,
                          paddingHorizontal: spacing.md,
                        },
                      ]}
                    >
                      <Text style={{ color: colors.text, fontWeight: typography.weights.semibold }}>
                        {secondaryAction.title || 'Cancel'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {primaryAction && (
                    <TouchableOpacity
                      onPress={primaryAction.onPress}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: colors.primary,
                          borderRadius: borderRadius.md,
                          paddingVertical: spacing.sm,
                          paddingHorizontal: spacing.md,
                        },
                      ]}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: typography.weights.bold }}>
                        {primaryAction.title || 'Confirm'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    marginRight: 4,
  },
});

export default Modal;
