import React from 'react';
import { View, Modal, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const BottomSheet = ({ isVisible, onClose, title, children }) => {
  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 max-h-[80%]">
              <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full self-center mb-4" />
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">{title}</Text>
                <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomSheet;
