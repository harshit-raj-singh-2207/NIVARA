/**
 * Community Stack Navigator for NIVARA.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COMMUNITY_ROUTES } from '../constants/routes';
import { useTheme } from '../theme';
import AppHeader from '../components/common/AppHeader';

const Stack = createNativeStackNavigator();

function CommunityFeedScreen() {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Community & Support" />
      <View style={[styles.content, { padding: spacing.md }]}>
        <Text style={{ color: colors.text, fontSize: typography.sizes.md }}>
          👥 NIVARA Peer Support & Community Hub
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, fontSize: typography.sizes.sm }}>
          Connect with caregivers, mentors, and sensory-friendly community members.
        </Text>
      </View>
    </View>
  );
}

export const CommunityNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={COMMUNITY_ROUTES.COMMUNITY_FEED}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={COMMUNITY_ROUTES.COMMUNITY_FEED} component={CommunityFeedScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default CommunityNavigator;
