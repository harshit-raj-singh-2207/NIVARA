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

          <HomeActionCard 
            title="Community"
            description="Connect with supportive groups and share experiences."
            icon="people"
            color="#10b981" 
            onPress={() => console.log('Navigate to Community')}
          />

          <HomeActionCard 
            title="Learning & Skills"
            description="Access interactive routines, courses, and calming sensory tools."
            icon="bulb"
            color="#f59e0b" 
            onPress={() => console.log('Navigate to Learning')}
          />

        </View>

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
