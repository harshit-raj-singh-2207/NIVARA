import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../hooks/useUser';

/**
 * Reusable Action Card for the Home Screen modules
 */
const HomeActionCard = ({ title, icon, color, description, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardDesc, { color: colors.text }]} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.text} style={{ opacity: 0.3 }} />
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { isCaregiver, user } = useUser();

  const userName = user?.name || "Friend";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Greeting Section */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello, {userName}!</Text>
          <Text style={[styles.subGreeting, { color: colors.text }]}>
            {isCaregiver ? "Here is your dashboard overview." : "What would you like to do today?"}
          </Text>
        </View>

        {/* Dynamic Modules Hub */}
        <View style={styles.modulesContainer}>
          
          <HomeActionCard 
            title="Safety & Tracking"
            description="View live physical locations and active safe zones."
            icon="shield-checkmark"
            color="#ef4444" 
            onPress={() => navigation.navigate('Safety')}
          />

          <HomeActionCard 
            title="AAC Communication"
            description="Express yourself quickly with picture boards and text-to-speech."
            icon="chatbubbles"
            color="#3b82f6" 
            onPress={() => console.log('Navigate to AAC')} // Will bind when AAC module is built
          />

          <View style={styles.quickCommRow}>
            {['I need help', 'I need space', "I can't speak", 'Sensory Overload'].map((phrase, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => handleQuickCommunication(phrase)}
                style={[
                  styles.quickCommChip,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.xs + 2,
                    paddingHorizontal: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: typography.sizes.xs,
                    fontWeight: typography.weights.semibold,
                  }}
                >
                  💬 {phrase}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <AppButton title="Open Communication Assistant" variant="outline" size="small" onPress={() => navigation.navigate('CommunicationFlow')} style={{ marginTop: spacing.sm }} />
        </AppCard>

        {/* 3. SAFETY & LOCATION STATUS WIDGET */}
        <AppCard variant="elevated" style={{ marginBottom: spacing.md }}>
          <View style={styles.cardHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              📍 Location & Geofence Safety
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: typography.sizes.xs }}>
              Sync: {bandStatus.lastSync}
            </Text>
          </View>

          <View style={styles.statusBoxRow}>
            <View
              style={[
                styles.statusBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  flex: 1,
                  marginRight: spacing.xs,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Current Zone
              </Text>
              <Text
                style={{
                  color: colors.status.success,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                  marginTop: 2,
                }}
              >
                {bandStatus.safeZone}
              </Text>
            </View>

            <View
              style={[
                styles.statusBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  flex: 1,
                  marginLeft: spacing.xs,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                GPS Band Battery
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                  marginTop: 2,
                }}
              >
                ⚡ {bandStatus.batteryLevel}% (Normal)
              </Text>
            </View>
          </View>
        </AppCard>

        {/* 4. ROUTINES & DAILY LIFE CARD */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            📅 Routines & Daily Life
          </Text>

          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.semibold,
            }}
          >
            Active Routine: {activeRoutine.title}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            Time: {activeRoutine.time}
          </Text>

          {/* Transition Warning Banner */}
          <View
            style={[
              styles.transitionBanner,
              {
                backgroundColor: colors.status.warningBackground,
                borderColor: colors.status.warning,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text
              style={{
                color: colors.status.warning,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
              }}
            >
              ⚠️ TRANSITION WARNING
            </Text>
            <Text style={{ color: colors.text, fontSize: typography.sizes.xs, marginTop: 2 }}>
              {activeRoutine.warning}
            </Text>
          </View>
          <AppButton title="Open Learning & Daily Life" variant="outline" size="small" onPress={() => navigation.navigate('LearningFlow')} style={{ marginTop: spacing.sm }} />
        </AppCard>

        {/* 5. CAREGIVER ACCESS TOGGLE / LINKED PATIENTS (ONLY IF USER IS CAREGIVER) */}
        {isCaregiver ? (
          <AppCard variant="elevated" style={{ marginBottom: spacing.lg }}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              👥 Linked Patients & Caregiver Monitoring
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.xs,
                marginBottom: spacing.md,
              }}
            >
              Real-time monitoring for users linked to your caregiver account.
            </Text>

            {linkedUsers && linkedUsers.length > 0 ? (
              linkedUsers.map((linkedUser, index) => (
                <View
                  key={linkedUser.id || index}
                  style={[
                    styles.linkedUserCard,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginBottom: spacing.xs,
                    },
                  ]}
                >
                  <View style={styles.linkedUserRow}>
                    <Avatar name={linkedUser.full_name} size="medium" status="online" />
                    <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: typography.sizes.sm,
                          fontWeight: typography.weights.bold,
                        }}
                      >
                        {linkedUser.full_name}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                        Status: 🟢 Home Geofence (Safe)
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <EmptyState
                icon="👥"
                title="No Linked Patients"
                description="You currently have no patient accounts linked to your caregiver dashboard."
                actionTitle="Link Patient Account"
                onActionPress={() => navigation && navigation.navigate('CaregiverVerification')}
              />
            )}
          </AppCard>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    opacity: 0.6,
    fontWeight: '500',
  },
  modulesContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 20,
  },
});

export default HomeScreen;
