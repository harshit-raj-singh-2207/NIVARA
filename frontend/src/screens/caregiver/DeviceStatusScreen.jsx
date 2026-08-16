import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceStatusCard from '../../components/caregiver/DeviceStatusCard';

const DeviceStatusScreen = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
       <View style={styles.header}>
         <Text style={[styles.title, { color: colors.text }]}>Device Management</Text>
       </View>
       <View style={styles.list}>
          <DeviceStatusCard deviceType="Nivara Bluetooth Band" battery={82} isConnected={true} />
          <DeviceStatusCard deviceType="Primary Mobile" battery={45} isConnected={true} />
       </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  list: { padding: 20 }
});
export default DeviceStatusScreen;
