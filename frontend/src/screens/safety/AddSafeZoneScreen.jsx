import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppCard from '../../components/common/AppCard';
import { lightTheme } from '../../theme/lightTheme';

const RADIUS_OPTIONS = [
  { label: '100m', value: 100 },
  { label: '250m', value: 250 },
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
];

const AddSafeZoneScreen = ({ navigation }) => {
  const [zoneName, setZoneName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(250);
  const [notes, setNotes] = useState('');

  const isFormValid = zoneName.trim().length > 0 && address.trim().length > 0;

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert('Missing Information', 'Please enter a zone name and address.');
      return;
    }

    // TODO: Persist safe zone via API / store
    Alert.alert(
      'Safe Zone Created',
      `"${zoneName}" has been added as a safe zone with a ${selectedRadius >= 1000 ? `${selectedRadius / 1000}km` : `${selectedRadius}m`} radius.`,
      [
        {
          text: 'OK',
          onPress: () => navigation?.goBack?.(),
        },
      ]
    );
  };

  return (
    <SafeAreaWrapper>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Add Safe Zone</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Zone Name */}
        <AppCard>
          <Text style={styles.label}>Zone Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Home, School, Grandma's"
            placeholderTextColor={lightTheme.colors.text.secondary}
            value={zoneName}
            onChangeText={setZoneName}
          />
        </AppCard>

        {/* Address / Location */}
        <AppCard>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address or place name"
            placeholderTextColor={lightTheme.colors.text.secondary}
            value={address}
            onChangeText={setAddress}
          />
          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>📍</Text>
            <Text style={styles.mapText}>
              {address.trim() ? address : 'Map preview will appear here'}
            </Text>
          </View>
        </AppCard>

        {/* Radius Selector */}
        <AppCard>
          <Text style={styles.label}>Safe Zone Radius</Text>
          <Text style={styles.helperText}>
            An alert is triggered if the wearer moves outside this radius.
          </Text>
          <View style={styles.radiusRow}>
            {RADIUS_OPTIONS.map((option) => {
              const isActive = selectedRadius === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.radiusChip,
                    isActive && styles.radiusChipActive,
                  ]}
                  onPress={() => setSelectedRadius(option.value)}
                >
                  <Text
                    style={[
                      styles.radiusChipText,
                      isActive && styles.radiusChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </AppCard>

        {/* Notes (optional) */}
        <AppCard>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="e.g. Only weekdays, 8am–3pm"
            placeholderTextColor={lightTheme.colors.text.secondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </AppCard>

        {/* Save Button */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            !isFormValid && styles.saveButtonDisabled,
            pressed && isFormValid && styles.saveButtonPressed,
          ]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.saveButtonText}>Save Safe Zone</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  /* ── Header ────────────────────────────── */
  header: {
    paddingHorizontal: lightTheme.spacing.lg,
    paddingTop: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.sm,
  },
  backButton: {
    marginBottom: lightTheme.spacing.sm,
  },
  backText: {
    fontSize: lightTheme.typography.size.sm,
    color: lightTheme.colors.primary,
    fontWeight: lightTheme.typography.weight.medium,
  },
  headerTitle: {
    fontSize: lightTheme.typography.size.xxxl,
    fontWeight: lightTheme.typography.weight.bold,
    color: lightTheme.colors.text.primary,
  },

  /* ── Content ───────────────────────────── */
  container: {
    padding: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.huge,
  },

  /* ── Form Fields ───────────────────────── */
  label: {
    fontSize: lightTheme.typography.size.md,
    fontWeight: lightTheme.typography.weight.semiBold,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.sm,
  },
  helperText: {
    fontSize: lightTheme.typography.size.sm,
    color: lightTheme.colors.text.secondary,
    marginBottom: lightTheme.spacing.md,
  },
  input: {
    backgroundColor: lightTheme.colors.background,
    borderRadius: lightTheme.borderRadius.md,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.md,
    fontSize: lightTheme.typography.size.md,
    color: lightTheme.colors.text.primary,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  multilineInput: {
    minHeight: 80,
  },

  /* ── Map Placeholder ───────────────────── */
  mapPlaceholder: {
    height: 150,
    backgroundColor: lightTheme.colors.background,
    borderRadius: lightTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: lightTheme.spacing.md,
  },
  mapIcon: {
    fontSize: 32,
    marginBottom: lightTheme.spacing.sm,
  },
  mapText: {
    color: lightTheme.colors.text.secondary,
    fontWeight: lightTheme.typography.weight.medium,
    fontSize: lightTheme.typography.size.sm,
    textAlign: 'center',
    paddingHorizontal: lightTheme.spacing.lg,
  },

  /* ── Radius Chips ──────────────────────── */
  radiusRow: {
    flexDirection: 'row',
    gap: lightTheme.spacing.sm,
  },
  radiusChip: {
    flex: 1,
    paddingVertical: lightTheme.spacing.md,
    borderRadius: lightTheme.borderRadius.md,
    backgroundColor: lightTheme.colors.background,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: lightTheme.colors.border,
  },
  radiusChipActive: {
    backgroundColor: lightTheme.colors.primaryLight,
    borderColor: lightTheme.colors.primary,
  },
  radiusChipText: {
    fontSize: lightTheme.typography.size.sm,
    fontWeight: lightTheme.typography.weight.semiBold,
    color: lightTheme.colors.text.secondary,
  },
  radiusChipTextActive: {
    color: lightTheme.colors.primaryDark,
  },

  /* ── Save Button ───────────────────────── */
  saveButton: {
    backgroundColor: lightTheme.colors.primary,
    paddingVertical: lightTheme.spacing.lg,
    borderRadius: lightTheme.borderRadius.md,
    alignItems: 'center',
    marginTop: lightTheme.spacing.lg,
    ...lightTheme.shadows.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  saveButtonText: {
    color: lightTheme.colors.text.inverse,
    fontSize: lightTheme.typography.size.lg,
    fontWeight: lightTheme.typography.weight.bold,
  },
});

export default AddSafeZoneScreen;
