import React from 'react';
import { Image, View, Text } from 'react-native';

export const Avatar = ({ source, name = '', size = 'md', isOnline = false, className = '' }) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return 'w-9 h-9 rounded-full';
      case 'lg': return 'w-16 h-16 rounded-full';
      case 'xl': return 'w-24 h-24 rounded-full';
      case 'md':
      default: return 'w-12 h-12 rounded-full';
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n[0].toUpperCase();
  };

  return (
    <View className={`relative ${className}`}>
      {source ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          className={`${getSizeStyle()} bg-slate-200 border-2 border-white dark:border-slate-800`}
        />
      ) : (
        <View className={`${getSizeStyle()} bg-[#5B8DEF] items-center justify-center border-2 border-white dark:border-slate-800`}>
          <Text className="text-white font-black text-sm">{getInitials(name)}</Text>
        </View>
      )}
      {isOnline && (
        <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF7D] rounded-full border-2 border-white dark:border-slate-900" />
      )}
    </View>
  );
};

export default Avatar;
