import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../hooks/useAuth';
import { lightTheme } from '../../theme';

const RoleSelectionScreen = () => {
  const { setRole, isLoading, error } = useAuth();
  
  // 'safety' | 'caregiver' | null
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    // Once the role is updated, the user.role state triggers RootNavigator
    // to automatically unmount the Auth stack and mount the correct Home stack!
    await setRole(selectedRole);
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>How will you use Nivara?</Text>
          <Text style={styles.subtitle}>
            This step customizes the app layout and features for your specific needs.
          </Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color={lightTheme.colors.status.emergency} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.cardsContainer}>
          {/* Option: Safety User (Supported Individual) */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setSelectedRole('safety')}
            style={[
              styles.roleCard,
              selectedRole === 'safety' && styles.roleCardActive
            ]}
          >
            <View style={[
              styles.iconWrapper, 
              selectedRole === 'safety' ? styles.iconActive : styles.iconInactive
            ]}>
              <Ionicons 
                name="shield-checkmark" 
                size={32} 
                color={selectedRole === 'safety' ? '#fff' : lightTheme.colors.primary} 
              />
            </View>
            <Text style={styles.roleTitle}>For Myself</Text>
            <Text style={styles.roleDescription}>
              I will be wearing the GPS band. I want the safety interface, SOS alerts, and location sharing tools.
            </Text>
          </TouchableOpacity>

          {/* Option: Caregiver */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setSelectedRole('caregiver')}
            style={[
              styles.roleCard,
              selectedRole === 'caregiver' && styles.roleCardActive
            ]}
          >
            <View style={[
              styles.iconWrapper, 
              selectedRole === 'caregiver' ? styles.iconActive : styles.iconInactive
            ]}>
              <Ionicons 
                name="people" 
                size={32} 
                color={selectedRole === 'caregiver' ? '#fff' : lightTheme.colors.primary} 
              />
            </View>
            <Text style={styles.roleTitle}>I'm a Caregiver</Text>
            <Text style={styles.roleDescription}>
              I will be tracking someone else. I need the dashboard to monitor locations, manage safe zones, and receive emergency alerts.
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      
      {/* Footer sticky area */}
      <View style={styles.footer}>
        <AppButton
          title="Complete Setup"
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  scrollContent: {
    padding: lightTheme.spacing.xl,
    paddingBottom: 100, // padding for footer
  },
  header: {
    marginBottom: lightTheme.spacing.xl,
    marginTop: lightTheme.spacing.md,
  },
  title: {
    ...lightTheme.typography.h1,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.xs,
  },
  subtitle: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.status.emergencyBg,
    padding: lightTheme.spacing.md,
    borderRadius: lightTheme.borderRadius.md,
    marginBottom: lightTheme.spacing.lg,
  },
  errorText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.status.emergency,
    marginLeft: lightTheme.spacing.sm,
    flex: 1,
  },
  cardsContainer: {
    gap: lightTheme.spacing.lg,
  },
  roleCard: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    borderWidth: 2,
    borderColor: lightTheme.colors.border,
    ...lightTheme.shadows.sm,
  },
  roleCardActive: {
    borderColor: lightTheme.colors.primary,
    backgroundColor: lightTheme.colors.primaryLight,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  iconInactive: {
    backgroundColor: lightTheme.colors.surfaceHover,
  },
  iconActive: {
    backgroundColor: lightTheme.colors.primary,
  },
  roleTitle: {
    ...lightTheme.typography.h2,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.xs,
  },
  roleDescription: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: lightTheme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : lightTheme.spacing.lg,
    backgroundColor: lightTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
});

export default RoleSelectionScreen;
