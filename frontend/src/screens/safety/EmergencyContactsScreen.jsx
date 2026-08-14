import React from 'react';
import { View, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import EmergencyContactCard from '../../components/safety/EmergencyContactCard';
import useSafetyStore from '../../store/safetyStore';

export const EmergencyContactsScreen = ({ navigation }) => {
  const { emergencyContacts } = useSafetyStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Emergency Contacts" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={emergencyContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <EmergencyContactCard contact={item} onCall={() => {}} />}
      />
    </SafeAreaWrapper>
  );
};

export default EmergencyContactsScreen;
