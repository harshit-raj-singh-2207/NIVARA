import React from 'react';
import { View, TouchableOpacity } from 'react-native';

export const AppCard = ({ children, onPress, className = '', style, accessibilityLabel }) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={accessibilityLabel}
      style={style}
      className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm mb-3.5 ${className}`}
    >
      {children}
    </CardWrapper>
  );
};

export default AppCard;
