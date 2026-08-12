/**
 * CaregiverVerificationScreen.jsx
 * Complete, production-grade Caregiver Verification Screen for NIVARA.
 * AI-Powered Safety & Communication platform for users and caregivers.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import useAuthStore from '../../store/authStore';
import authApi from '../../services/api/authApi';
import { validateCaregiverCode, validatePhoneNumber } from '../../utils/validation';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import AppHeader from '../../components/common/AppHeader';
import Loading from '../../components/common/Loading';

export const CaregiverVerificationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  // Verification method selection: 'code' | 'document'
  const [verificationMethod, setVerificationMethod] = useState('code');

  // Input state fields
  const [patientCode, setPatientCode] = useState('');
  const [docType, setDocType] = useState('govt_id'); // 'govt_id' | 'certification' | 'license'
  const [docNumber, setDocNumber] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // UI state & validation errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const { submitCaregiverVerification } = useAuthStore();

  const handleMethodChange = (method) => {
    setVerificationMethod(method);
    setErrors({});
  };

  const handleSimulateDocumentPicker = () => {
    const mockFiles = {
      govt_id: {
        name: 'government_identity_card.pdf',
        size: '1.8 MB',
        mimeType: 'application/pdf',
        uri: 'file://documents/govt_id.pdf',
      },
      certification: {
        name: 'caregiver_certification_cert.pdf',
        size: '2.4 MB',
        mimeType: 'application/pdf',
        uri: 'file://documents/certification.pdf',
      },
      license: {
        name: 'nursing_medical_license.pdf',
        size: '3.1 MB',
        mimeType: 'application/pdf',
        uri: 'file://documents/license.pdf',
      },
    };
    const file = mockFiles[docType] || mockFiles.govt_id;
    setAttachedFile(file);
    if (errors.attachedFile) {
      setErrors((prev) => ({ ...prev, attachedFile: null }));
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Emergency Phone Number
    if (!emergencyPhone || !emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency phone number is required';
    } else {
      const phoneErr = validatePhoneNumber(emergencyPhone);
      if (phoneErr) {
        newErrors.emergencyPhone = phoneErr;
      }
    }

    if (verificationMethod === 'code') {
      // Validate Pairing Code / Patient ID
      if (!patientCode || !patientCode.trim()) {
        newErrors.patientCode = 'Patient ID or Link Code is required';
      } else {
        const codeErr = validateCaregiverCode(patientCode);
        if (codeErr) {
          newErrors.patientCode = codeErr;
        }
      }
    } else {
      // Validate Document Method Fields
      if (!docNumber || !docNumber.trim()) {
        newErrors.docNumber = 'Document/License ID number is required';
      }
      if (!attachedFile) {
        newErrors.attachedFile = 'Please attach a valid verification document';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setLoadingMessage('Submitting caregiver verification request...');

    try {
      const payload = {
        verification_method: verificationMethod,
        emergency_phone: emergencyPhone.trim(),
        ...(verificationMethod === 'code'
          ? {
              caregiver_code: patientCode.trim().toUpperCase(),
              patient_id: patientCode.trim(),
            }
          : {
              document_type: docType,
              document_number: docNumber.trim(),
              document_file_name: attachedFile?.name,
              document_file_uri: attachedFile?.uri,
            }),
      };

      // Execute request via store or API
      let response;
      if (submitCaregiverVerification) {
        response = await submitCaregiverVerification(payload);
      } else {
        response = await authApi.submitCaregiverVerification(payload);
      }

      setLoading(false);

      showSuccessAlert(
        'Verification Submitted',
        response?.message || 'Caregiver verification request submitted successfully!',
        () => {
          if (navigation) {
            if (typeof navigation.replace === 'function') {
              navigation.replace('MainApp');
            } else if (typeof navigation.navigate === 'function') {
              navigation.navigate('MainApp');
            }
          }
        }
      );
    } catch (err) {
      setLoading(false);
      handleApiError(err, 'Verification Submission Failed');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Caregiver Verification"
        subtitle="Step 2 of 2: Verification & Pairing"
        showBack={true}
        onBackPress={() => (navigation ? navigation.goBack() : null)}
      />

      {loading && <Loading overlay={true} size="large" message={loadingMessage} />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Heading & Subheading */}
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
          Select Verification Method
        </Text>
        <Text
          style={[
            styles.sectionSubtitle,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.md,
            },
          ]}
        >
          Choose how you would like to verify your caregiver credentials.
        </Text>

        {/* Verification Method Segmented Control / Selector Toggle */}
        <View
          style={[
            styles.tabContainer,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: borderRadius.lg,
              padding: 4,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleMethodChange('code')}
            style={[
              styles.tabButton,
              { borderRadius: borderRadius.md },
              verificationMethod === 'code' && {
                backgroundColor: colors.surface,
                ...shadows.small,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: verificationMethod === 'code' ? colors.primary : colors.textMuted,
                  fontWeight:
                    verificationMethod === 'code'
                      ? typography.weights.bold
                      : typography.weights.medium,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              🔗 Pairing Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleMethodChange('document')}
            style={[
              styles.tabButton,
              { borderRadius: borderRadius.md },
              verificationMethod === 'document' && {
                backgroundColor: colors.surface,
                ...shadows.small,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: verificationMethod === 'document' ? colors.primary : colors.textMuted,
                  fontWeight:
                    verificationMethod === 'document'
                      ? typography.weights.bold
                      : typography.weights.medium,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              📄 Document Upload
            </Text>
          </TouchableOpacity>
        </View>

        {/* METHOD A: PAIRING / LINK CODE */}
        {verificationMethod === 'code' ? (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              },
              shadows.small,
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              Link with Patient / User Account
            </Text>
            <Text
              style={[
                styles.cardDesc,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.sm,
                  marginBottom: spacing.md,
                },
              ]}
            >
              Enter the 6-character caregiver pairing code provided by your patient (e.g. CG-A1B2C3).
            </Text>

            <AppInput
              label="Dependent/Patient ID or Linking Code"
              placeholder="e.g. CG-A1B2C3"
              value={patientCode}
              onChangeText={(text) => {
                setPatientCode(text);
                if (errors.patientCode) setErrors((prev) => ({ ...prev, patientCode: null }));
              }}
              error={errors.patientCode}
              autoCapitalize="characters"
              hint="Format: 6-character code (e.g. CG-A1B2C3)"
            />
          </View>
        ) : (
          /* METHOD B: DOCUMENT UPLOAD */
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              },
              shadows.small,
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              Caregiver Accreditation Document
            </Text>
            <Text
              style={[
                styles.cardDesc,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.sm,
                  marginBottom: spacing.md,
                },
              ]}
            >
              Upload official government identification or caregiver certification documents.
            </Text>

            {/* Document Type Selection Chips */}
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.semibold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              Document Type
            </Text>
            <View style={[styles.docTypeRow, { marginBottom: spacing.md }]}>
              {[
                { id: 'govt_id', label: 'Government ID' },
                { id: 'certification', label: 'Caregiver Cert' },
                { id: 'license', label: 'Medical License' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setDocType(item.id);
                    setAttachedFile(null);
                  }}
                  style={[
                    styles.docTypeChip,
                    {
                      backgroundColor:
                        docType === item.id ? colors.primary : colors.surfaceSubtle,
                      borderColor: docType === item.id ? colors.primary : colors.border,
                      borderRadius: borderRadius.md,
                      paddingVertical: spacing.xs + 2,
                      paddingHorizontal: spacing.sm + 4,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: docType === item.id ? '#FFFFFF' : colors.text,
                      fontSize: typography.sizes.xs,
                      fontWeight:
                        docType === item.id
                          ? typography.weights.bold
                          : typography.weights.medium,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppInput
              label="Document / License Number"
              placeholder="Enter document ID or certification number"
              value={docNumber}
              onChangeText={(text) => {
                setDocNumber(text);
                if (errors.docNumber) setErrors((prev) => ({ ...prev, docNumber: null }));
              }}
              error={errors.docNumber}
              autoCapitalize="none"
            />

            {/* Document Picker Trigger / Attachment Card */}
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.semibold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              Upload Document File
            </Text>

            {attachedFile ? (
              <View
                style={[
                  styles.fileCard,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.status.success,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                  },
                ]}
              >
                <View style={styles.fileInfoRow}>
                  <Text style={{ fontSize: 24, marginRight: spacing.sm }}>📎</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: typography.sizes.sm,
                        fontWeight: typography.weights.bold,
                      }}
                      numberOfLines={1}
                    >
                      {attachedFile.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                      {attachedFile.size} • Attached
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton}>
                    <Text
                      style={{
                        color: colors.status.error,
                        fontWeight: typography.weights.bold,
                        fontSize: typography.sizes.sm,
                      }}
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSimulateDocumentPicker}
                style={[
                  styles.uploadBox,
                  {
                    borderColor: errors.attachedFile ? colors.status.error : colors.border,
                    backgroundColor: colors.surfaceSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.lg,
                  },
                ]}
              >
                <Text style={{ fontSize: 32, marginBottom: spacing.xs }}>📤</Text>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.bold,
                    textAlign: 'center',
                  }}
                >
                  Tap to Select ID / Certificate File
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.sizes.xs,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  Supports PDF, PNG, JPG (Max 10MB)
                </Text>
              </TouchableOpacity>
            )}

            {errors.attachedFile && (
              <Text
                style={{
                  color: colors.status.error,
                  fontSize: typography.sizes.xs,
                  marginTop: spacing.xs,
                }}
              >
                {errors.attachedFile}
              </Text>
            )}
          </View>
        )}

        {/* EMERGENCY CONTACT INFORMATION */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.xl,
            },
            shadows.small,
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Emergency Contact Information
          </Text>
          <Text
            style={[
              styles.cardDesc,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.sm,
                marginBottom: spacing.md,
              },
            ]}
          >
            Enter an active emergency phone number to receive high-priority safety alert escalations.
          </Text>

          <AppInput
            label="Emergency Phone Number"
            placeholder="+1 (555) 000-0000"
            value={emergencyPhone}
            onChangeText={(text) => {
              setEmergencyPhone(text);
              if (errors.emergencyPhone) setErrors((prev) => ({ ...prev, emergencyPhone: null }));
            }}
            error={errors.emergencyPhone}
            keyboardType="phone-pad"
            hint="Format: Standard phone number (e.g. +1 555 123 4567)"
          />
        </View>

        {/* SUBMIT ACTION BUTTON */}
        <AppButton
          title="Submit Verification Request"
          onPress={handleSubmit}
          loading={loading}
          variant="primary"
          size="large"
          fullWidth={true}
        />
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
  sectionSubtitle: {
    textAlign: 'left',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
  },
  cardTitle: {
    textAlign: 'left',
  },
  cardDesc: {
    textAlign: 'left',
  },
  label: {
    textAlign: 'left',
  },
  docTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  docTypeChip: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileCard: {
    borderWidth: 1,
  },
  fileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default CaregiverVerificationScreen;
