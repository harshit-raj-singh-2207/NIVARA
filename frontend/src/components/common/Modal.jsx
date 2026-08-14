import React from 'react';
import { View, Modal as RNModal, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Modal = ({ isVisible, onClose, title, children }) => {
  if (!isVisible) return null;

  return (
    <RNModal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 items-center justify-center p-5">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-100 dark:border-slate-800 shadow-xl">
              <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Text className="text-lg font-black text-[#1F2937] dark:text-white">{title || 'Notice'}</Text>
                <TouchableOpacity
                  onPress={onClose}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Close dialog"
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default Modal;
