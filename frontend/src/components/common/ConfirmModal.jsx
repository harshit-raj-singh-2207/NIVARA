import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import AppButton from './AppButton';

export const ConfirmModal = ({
  isVisible,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 items-center justify-center p-5">
        <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-100 dark:border-slate-800">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</Text>
          <Text className="text-sm text-slate-600 dark:text-slate-300 mb-6">{description}</Text>
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <AppButton title={cancelText} variant="outline" onPress={onClose} />
            </View>
            <View className="flex-1">
              <AppButton
                title={confirmText}
                variant={isDanger ? 'danger' : 'primary'}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
