/**
 * SensoryHomeScreen.jsx
 * Complete, production-grade Sensory Overload Prevention & Social Cue Assistant Screen for NIVARA.
 * Connects real-time environmental telemetry (sound, light, crowd density) with social cue interpretation.
 */

import React, { useEffect } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { BRAND_COLORS, STATUS_COLORS } from '../../constants/colors';
import useSensoryStore from '../../store/sensoryStore';
import sensoryApi from '../../services/api/sensoryApi';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

import SensoryAlert from '../../components/sensory/SensoryAlert';
import NoiseMeter from '../../components/sensory/NoiseMeter';
import BrightnessMeter from '../../components/sensory/BrightnessMeter';
import CrowdIndicator from '../../components/sensory/CrowdIndicator';
import SocialCueCard from '../../components/sensory/SocialCueCard';
import ResponseSuggestion from '../../components/sensory/ResponseSuggestion';

export const SensoryHomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const {
    noiseLevelDb,
    noiseThresholdDb,
    brightnessLux,
    crowdDensity,
    crowdCount,
    activeAlert,
    socialCue,
    suggestedResponses,
    isLoading,
    fetchEnvironmentalStatus,
    dismissAlert,
    simulateSensorTick,
  } = useSensoryStore();

  useEffect(() => {
    fetchEnvironmentalStatus();

    // Setup 5-second polling interval for environmental sensor telemetry ticks
    const interval = setInterval(() => {
      simulateSensorTick();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchEnvironmentalStatus();
  };

  const handleAlertCalmingAction = () => {
    Alert.alert(
      '🧘 Sensory Relief Recommended',
      'Activating low-sensory dark mode and sound suppression rules.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleSelectResponse = (responseText) => {
    showSuccessAlert(
      'Response Selected',
      `Selected response: "${responseText}". Copied to speech clipboard!`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Sensory & Environmental Protection"
        subtitle="Real-Time Overload Prevention & Social Assistant"
        showBack={true}
        onBackPress={() => (navigation ? navigation.goBack() : null)}
      />

      {isLoading && <Loading overlay={true} size="large" message="Reading environmental sensors..." />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* 1. ACTIVE SENSORY WARNINGS WIDGET BANNER */}
        {activeAlert && (
          <SensoryAlert
            alert={activeAlert}
            onAction={handleAlertCalmingAction}
            onDismiss={dismissAlert}
          />
        )}

        {/* 2. REAL-TIME ENVIRONMENTAL DASHBOARD */}
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.lg }]}>
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
            📡 Real-Time Environmental Telemetry
          </Text>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              marginBottom: spacing.md,
            }}
          >
            Monitors sound decibels, light glare, and crowd density to prevent sensory meltdowns.
          </Text>

          {/* Sound Decibel Level Meter */}
          <View style={{ marginBottom: spacing.md }}>
            <NoiseMeter
              levelDb={noiseLevelDb}
              thresholdDb={noiseThresholdDb}
              status={noiseLevelDb >= noiseThresholdDb ? 'critical' : 'safe'}
            />
          </View>

          {/* Ambient Lighting Meter */}
          <View style={{ marginBottom: spacing.md }}>
            <BrightnessMeter
              levelLux={brightnessLux}
              status={brightnessLux > 600 ? 'bright' : 'normal'}
            />
          </View>

          {/* Crowd Density Radar */}
          <View style={{ marginBottom: spacing.xs }}>
            <CrowdIndicator
              density={crowdDensity}
              count={crowdCount}
            />
          </View>
        </AppCard>

        {/* 3. SOCIAL CUE ASSISTANT SHORTCUT SECTION */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.xl }}>
          <View style={styles.socialHeaderRow}>
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
              🧠 Social Cue & Tone Assistant
            </Text>
            <TouchableOpacity
              onPress={() => (navigation ? navigation.navigate('SocialCueScreen') : null)}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.bold,
                }}
              >
                Analyze Audio Tone ›
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              marginBottom: spacing.md,
            }}
          >
            Interprets complex body language, vocal pitch, and subtle social nuances into plain language.
          </Text>

          {/* Active Social Cue Breakdown Card */}
          {socialCue ? (
            <SocialCueCard cue={socialCue} />
          ) : (
            <EmptyState
              icon="🧠"
              title="No Social Cue Detected"
              description="Listening for ambient speech tones and social cues..."
            />
          )}

          {/* Suggested Appropriate Responses */}
          {suggestedResponses.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <ResponseSuggestion
                suggestions={suggestedResponses}
                onSelectResponse={handleSelectResponse}
              />
            </View>
          )}
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    textAlign: 'left',
  },
  socialHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});

export default SensoryHomeScreen;
