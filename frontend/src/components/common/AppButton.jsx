import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

export const AppButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'accent', 'danger', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  isDisabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  accessibilityLabel,
  accessibilityHint,
  className = '',
  style,
}) => {
  const getBackgroundColor = () => {
    if (isDisabled) return 'bg-slate-300 dark:bg-slate-700';
    switch (variant) {
      case 'secondary':
        return 'bg-[#6FCF97] active:bg-[#4DB97A]';
      case 'accent':
        return 'bg-[#F6D365] active:bg-[#E5BD45]';
      case 'danger':
        return 'bg-[#E57373] active:bg-[#D35252]';
      case 'outline':
        return 'bg-transparent border-2 border-[#5B8DEF] active:bg-[#5B8DEF]/10';
      case 'ghost':
        return 'bg-transparent active:bg-slate-100 dark:active:bg-slate-800';
      case 'primary':
      default:
        return 'bg-[#5B8DEF] active:bg-[#4171D6]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2.5 rounded-xl min-h-[40px]';
      case 'lg':
        return 'px-6 py-4 rounded-2xl min-h-[56px]';
      case 'md':
      default:
        return 'px-5 py-3.5 rounded-2xl min-h-[48px]';
    }
  };

  const getTextStyles = () => {
    if (isDisabled) return 'text-slate-500 dark:text-slate-400 font-semibold';
    switch (variant) {
      case 'accent':
        return 'text-[#1F2937] font-bold';
      case 'outline':
      case 'ghost':
        return 'text-[#5B8DEF] font-bold';
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return 'text-white font-bold';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'md':
      default: return 'text-base';
    }
  };

  const isOutline = variant === 'outline' || variant === 'ghost';
  const iconColor = isDisabled 
    ? '#94A3B8' 
    : variant === 'accent' 
    ? '#1F2937' 
    : isOutline 
    ? '#5B8DEF' 
    : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled || isLoading }}
      style={style}
      className={`flex-row items-center justify-center ${getSizeStyles()} ${getBackgroundColor()} ${
        fullWidth ? 'w-full' : 'self-start'
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color={iconColor} size={size === 'sm' ? 'small' : 'small'} />
      ) : (
        <View className="flex-row items-center justify-center space-x-2">
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20} color={iconColor} style={{ marginRight: 6 }} />
          )}
          <Text className={`${getTextSizeStyles()} ${getTextStyles()} text-center`}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20} color={iconColor} style={{ marginLeft: 6 }} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
