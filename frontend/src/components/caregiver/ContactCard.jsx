import React from 'react';
import { View, Text } from 'react-native';
import AppCard from '../common/AppCard';

export const ContactCard = ({ name, role, phone }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View>
        <Text className="text-base font-bold text-slate-900 dark:text-white">{name}</Text>
        <Text className="text-xs text-slate-500 mt-0.5">{role} • {phone}</Text>
      </View>
    </AppCard>
  );
};

export default ContactCard;
