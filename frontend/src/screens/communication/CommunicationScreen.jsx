/**
 * CommunicationScreen.jsx
 * Production-grade Emotion-Aware AI Communication & AAC Hub for NIVARA.
 * Connects AAC symbol grids, quick emergency needs, AI sentence generation, and Text-to-Speech synthesis.
 */

import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { AAC_BUTTON_COLORS, BRAND_COLORS, STATUS_COLORS } from '../../constants/colors';
import useCommunicationStore from '../../store/communicationStore';
import communicationApi from '../../services/api/communicationApi';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

import AACGrid from '../../components/communication/AACGrid';
import QuickNeedButton from '../../components/communication/QuickNeedButton';
import SpeechButton from '../../components/communication/SpeechButton';
import EmotionSelector from '../../components/communication/EmotionSelector';
import SentenceSuggestion from '../../components/communication/SentenceSuggestion';

export const CommunicationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const {
    activeEmotion,
    selectedStyle,
    inputText,
    suggestions,
    isLoading,
    setActiveEmotion,
    setSelectedStyle,
    setInputText,
    generateAISentences,
    simplifyInputText,
    sendQuickNeedAlert,
  } = useCommunicationStore();

  const [aiProcessing, setAiProcessing] = useState(false);

  const handleQuickNeedPress = async (needTitle, color) => {
    try {
      await sendQuickNeedAlert(needTitle);
      showSuccessAlert(
        'Quick Alert Dispatched',
        `Caregiver notified: "${needTitle}" has been sent to your primary emergency contacts.`
      );
    } catch (err) {
      handleApiError(err, 'Alert Dispatch Failed');
    }
  };

  const handleSimplifyPress = async () => {
    if (!inputText.trim()) {
      Alert.alert('Input Empty', 'Please enter or select text before simplifying.');
      return;
    }
    setAiProcessing(true);
    try {
      await simplifyInputText();
    } catch (err) {
      handleApiError(err, 'AI Simplification Failed');
    } finally {
      setAiProcessing(false);
    }
  };

  const handleGeneratePress = async () => {
    setAiProcessing(true);
    try {
      await generateAISentences();
    } catch (err) {
      handleApiError(err, 'AI Sentence Generation Failed');
    } finally {
      setAiProcessing(false);
    }
  };

  const handleSelectSymbol = (symbol) => {
    const newText = inputText ? `${inputText} ${symbol.label}` : symbol.label;
    setInputText(newText);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Communication Hub"
        subtitle="AI Sentence Generator & AAC Non-Verbal Tools"
        showBack={true}
        onBackPress={() => (navigation ? navigation.goBack() : null)}
        rightComponent={
          <View
            style={[
              styles.emotionHeaderBadge,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Text style={{ fontSize: 12, color: colors.primary, fontWeight: 'bold' }}>
              STATE: {activeEmotion.toUpperCase()}
            </Text>
          </View>
        }
      />

      {(isLoading || aiProcessing) && (
        <Loading overlay={true} size="large" message="AI processing sensory communication..." />
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. QUICK NEED SHORTCUT BUTTONS BAR */}
        <Text
          style={[
            styles.sectionHeader,
            {
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
              marginBottom: spacing.xs,
            },
          ]}
        >
          ⚡ Quick Communication Alerts
        </Text>

        <View style={[styles.quickNeedsRow, { marginBottom: spacing.lg }]}>
          <QuickNeedButton
            title="I Need Help"
            icon="🚨"
            color={AAC_BUTTON_COLORS.needHelp}
            onPress={() => handleQuickNeedPress('I Need Help', AAC_BUTTON_COLORS.needHelp)}
          />
          <QuickNeedButton
            title="I Need Space"
            icon="🧘"
            color={AAC_BUTTON_COLORS.needSpace}
            onPress={() => handleQuickNeedPress('I Need Space', AAC_BUTTON_COLORS.needSpace)}
          />
          <QuickNeedButton
            title="I Can't Speak"
            icon="🔇"
            color={AAC_BUTTON_COLORS.cantSpeak}
            onPress={() => handleQuickNeedPress("I Can't Speak", AAC_BUTTON_COLORS.cantSpeak)}
          />
        </View>

        {/* 2. EMOTION SELECTOR BAR */}
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.text,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            🎭 Select Emotional State
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              marginBottom: spacing.sm,
            }}
          >
            NIVARA AI adapts sentence tone and vocabulary based on your selected mood.
          </Text>

          <EmotionSelector
            selectedEmotion={activeEmotion}
            onSelectEmotion={(emo) => setActiveEmotion(emo)}
          />
        </AppCard>

        {/* 3. INPUT & AI ASSISTANCE SECTION */}
        <AppCard variant="bordered" style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.text,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            💬 Input Text & AI Sentence Generator
          </Text>

          <AppInput
            label="Type or Tap AAC Symbols below:"
            placeholder="e.g. Need water or feeling loud..."
            value={inputText}
            onChangeText={setInputText}
            multiline={true}
            numberOfLines={3}
            rightIcon={
              inputText ? (
                <SpeechButton text={inputText} size="small" />
              ) : null
            }
          />

          {/* Style Selector Chips */}
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.semibold,
              marginBottom: 6,
            }}
          >
            Communication Tone Style:
          </Text>

          <View style={[styles.styleSelectorRow, { marginBottom: spacing.md }]}>
            {[
              { id: 'simple', label: 'Simple' },
              { id: 'friendly', label: 'Friendly' },
              { id: 'formal', label: 'Formal' },
            ].map((styleItem) => (
              <TouchableOpacity
                key={styleItem.id}
                onPress={() => setSelectedStyle(styleItem.id)}
                style={[
                  styles.styleChip,
                  {
                    backgroundColor:
                      selectedStyle === styleItem.id ? colors.primary : colors.surfaceSubtle,
                    borderColor:
                      selectedStyle === styleItem.id ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedStyle === styleItem.id ? '#FFFFFF' : colors.text,
                    fontSize: typography.sizes.xs,
                    fontWeight:
                      selectedStyle === styleItem.id
                        ? typography.weights.bold
                        : typography.weights.medium,
                  }}
                >
                  {styleItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.aiActionRow}>
            <AppButton
              title="Simplify Text"
              onPress={handleSimplifyPress}
              variant="secondary"
              size="small"
              fullWidth={false}
              style={{ flex: 1, marginRight: 6 }}
            />
            <AppButton
              title="✨ Generate AI Sentences"
              onPress={handleGeneratePress}
              variant="primary"
              size="small"
              fullWidth={false}
              style={{ flex: 1.3 }}
            />
          </View>

          {/* AI Sentence Suggestions Component */}
          <View style={{ marginTop: spacing.md }}>
            <SentenceSuggestion
              suggestions={suggestions}
              onSelectSuggestion={(phrase) => setInputText(phrase)}
            />
          </View>
        </AppCard>

        {/* 4. AAC SYMBOL GRID SECTION */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.xl }}>
          <View style={styles.aacHeaderRow}>
            <Text
              style={[
                styles.sectionHeader,
                {
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              🎨 AAC Picture Symbol Grid
            </Text>
            <TouchableOpacity
              onPress={() => (navigation ? navigation.navigate('AACScreen') : null)}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.bold,
                }}
              >
                Full Screen Grid ›
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
            Tap symbols to build phrases dynamically without typing.
          </Text>

          <AACGrid onSelectSymbol={handleSelectSymbol} />
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
  emotionHeaderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  sectionHeader: {
    textAlign: 'left',
  },
  quickNeedsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styleSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  styleChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  aiActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aacHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});

export default CommunicationScreen;
