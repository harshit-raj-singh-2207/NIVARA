import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../hooks/useUser';

const ProfileOption = ({ icon, title, subtitle, onPress, color }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.optionCard, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.optionIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.optionSubtitle, { color: colors.text }]}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, isCaregiver, clearUser } = useUser();

  const handleLogout = () => {
    clearUser(); // In the future, this will redirect natively to the login stack
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Avatar */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={48} color="#fff" />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || "Nivara Member"}</Text>
          <Text style={[styles.roleLabel, { color: colors.primary }]}>
            {isCaregiver ? "Caregiver Account" : "Standard Account"}
          </Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          <ProfileOption 
            icon="person" 
            title="Edit Profile" 
            subtitle="Update your personal details"
            color="#3b82f6" 
            onPress={() => console.log('Route to Edit Profile')} 
          />
          <ProfileOption 
            icon="settings" 
            title="App Settings" 
            subtitle="Theme, Notifications, and Accessibility"
            color="#8b5cf6" 
            onPress={() => console.log('Route to Settings')} 
          />
          <ProfileOption 
            icon="shield-checkmark" 
            title="Safety Configurations" 
            subtitle="Manage emergency contacts & permissions"
            color="#ef4444" 
            onPress={() => console.log('Route to Safety Settings')} 
          />
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatarContainer: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 12 
  },
  name: { fontSize: 24, fontWeight: '800' },
  roleLabel: { fontSize: 14, fontWeight: '600', marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  optionsList: { gap: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 8 },
  optionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  optionSubtitle: { fontSize: 13, opacity: 0.6 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 24, borderRadius: 16, backgroundColor: '#fee2e2' },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }
});

export default ProfileScreen;
