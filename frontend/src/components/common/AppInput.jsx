import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AppInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  keyboardType = 'default',
  accessibilityLabel,
  className = '',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && (
        <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-2xl px-4 py-3.5 bg-white dark:bg-slate-800 ${
          error ? 'border-[#E57373]' : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        {icon && (
          <Ionicons name={icon} size={20} color="#64748B" style={{ marginRight: 10 }} />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          accessible={true}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          className="flex-1 text-base text-[#1F2937] dark:text-white p-0 font-medium"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="p-1"
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            accessible={true}
            accessibilityRole="button"
            className="p-1"
          >
            <Ionicons name={rightIcon} size={20} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-xs font-semibold text-[#E57373] mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default AppInput;
