import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SafeAreaWrapper = ({ children, className = '' }) => {
  return (
    <SafeAreaView className={`flex-1 bg-slate-50 dark:bg-slate-900 ${className}`}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
