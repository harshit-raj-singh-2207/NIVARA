import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import ContactCard from '../../components/caregiver/ContactCard';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import AppModal from '../../components/common/AppModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Divider from '../../components/common/Divider';
import { useSafety } from '../../hooks/useSafety';
import { validateEmergencyContact } from '../../utils/validation';
import { lightTheme } from '../../theme';

const EMPTY_FORM = { name: '', phone: '', relationship: '' };

/**
 * Emergency Contacts management screen.
 * Allows adding and deleting emergency contacts, displayed in priority order.
 */
const EmergencyContactsScreen = ({ navigation }) => {
  const { contacts, isLoading, loadDashboardData, addContact, removeContact } = useSafety();

  // Add contact modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirm modal state
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (contacts.length === 0) {
      loadDashboardData();
    }
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear that field's error when the user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [formErrors]);

  const handleAddContact = useCallback(async () => {
    // Validate
    const validation = validateEmergencyContact(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    const success = await addContact(formData);
    setIsSaving(false);

    if (success) {
      setShowAddModal(false);
      setFormData(EMPTY_FORM);
      setFormErrors({});
    } else {
      Alert.alert('Error', 'Failed to add contact. Please try again.');
    }
  }, [formData, addContact]);

  const handleDeleteRequest = useCallback((id) => {
    setPendingDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    const success = await removeContact(pendingDeleteId);
    setIsDeleting(false);
    if (!success) {
      Alert.alert('Error', 'Failed to remove contact. Try again.');
    }
    setPendingDeleteId(null);
  }, [pendingDeleteId, removeContact]);

  const openAddModal = useCallback(() => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setShowAddModal(true);
  }, []);

  const renderContact = useCallback(({ item }) => (
    <ContactCard contact={item} onDelete={handleDeleteRequest} />
  ), [handleDeleteRequest]);

  if (isLoading && contacts.length === 0) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Emergency Contacts" showBack />
        <Loading message="Loading contacts..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader 
        title="Emergency Contacts" 
        showBack 
        rightIcon="add-circle-outline"
        onRightPress={openAddModal}
      />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.listContent}
        onRefresh={loadDashboardData}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          contacts.length > 0 ? (
            <Text style={styles.infoText}>
              Contacts are notified automatically when an SOS is triggered, in the order listed below.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Emergency Contacts"
            message="Add trusted people who should be alerted if an emergency occurs. They can also receive your location."
            buttonText="Add First Contact"
            onButtonPress={openAddModal}
          />
        }
        ListFooterComponent={
          contacts.length > 0 ? (
            <View style={styles.footer}>
              <AppButton 
                title="Add Contact"
                variant="outline"
                leftIcon="person-add-outline"
                onPress={openAddModal}
              />
            </View>
          ) : null
        }
      />

      {/* ── Add Contact Modal ─────────────────────── */}
      <AppModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Emergency Contact"
      >
        <AppInput
          label="Full Name"
          icon="person-outline"
          placeholder="e.g. Jane Doe"
          value={formData.name}
          onChangeText={(val) => handleFieldChange('name', val)}
          error={formErrors.name}
          autoCapitalize="words"
        />
        <AppInput
          label="Phone Number"
          icon="call-outline"
          placeholder="e.g. +91 98765 43210"
          value={formData.phone}
          onChangeText={(val) => handleFieldChange('phone', val)}
          error={formErrors.phone}
          keyboardType="phone-pad"
        />
        <AppInput
          label="Relationship"
          icon="heart-outline"
          placeholder="e.g. Parent, Therapist, Friend"
          value={formData.relationship}
          onChangeText={(val) => handleFieldChange('relationship', val)}
          error={formErrors.relationship}
          autoCapitalize="words"
        />
        <Divider marginVertical={lightTheme.spacing.md} />
        <AppButton 
          title="Save Contact" 
          onPress={handleAddContact} 
          isLoading={isSaving} 
        />
      </AppModal>

      {/* ── Delete Confirm Modal ──────────────────── */}
      <ConfirmModal
        visible={!!pendingDeleteId}
        title="Remove Contact"
        message="This person will no longer be notified during emergencies. Are you sure?"
        confirmText="Remove"
        cancelText="Cancel"
        isDestructive
        isLoading={isDeleting}
        icon="person-remove-outline"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  listContent: {
    padding: lightTheme.spacing.md,
    flexGrow: 1,
  },
  infoText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginBottom: lightTheme.spacing.lg,
    lineHeight: 20,
  },
  footer: {
    marginTop: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.xl,
  },
});

export default EmergencyContactsScreen;
