/**
 * Error Handling Utility for NIVARA frontend.
 * Provides helper functions for parsing errors and displaying alerts/modals.
 */

import { Alert } from 'react-native';

/**
 * Extracts a user-friendly error message string from any error object or response.
 */
export const parseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred. Please try again.';
  if (typeof error === 'string') return error;
  if (error.error?.message) return error.error.message;
  if (error.message) return error.message;
  if (error.detail) return error.detail;
  if (Array.isArray(error.detail)) {
    return error.detail.map((err) => err.msg || err.message).join('\n');
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Alias helper for API error parsing.
 */
export const parseApiError = (error) => {
  return parseErrorMessage(error);
};

/**
 * Shows a native alert for API or runtime errors.
 */
export const handleApiError = (error, title = 'Error', onConfirm = null) => {
  const message = parseErrorMessage(error);
  Alert.alert(
    title,
    message,
    [{ text: 'OK', onPress: () => onConfirm && onConfirm() }],
    { cancelable: true }
  );
  return message;
};

/**
 * Utility to display an error alert with custom title and callback.
 */
export const showErrorAlert = (title, message, onPress) => {
  Alert.alert(
    title || 'Error',
    message || 'Something went wrong. Please check your connection and try again.',
    [{ text: 'OK', onPress }],
    { cancelable: true }
  );
};

/**
 * Utility to display a success alert.
 */
export const showSuccessAlert = (title, message, onPress) => {
  Alert.alert(
    title || 'Success',
    message || 'Action completed successfully.',
    [{ text: 'OK', onPress }],
    { cancelable: false }
  );
};

export default {
  parseErrorMessage,
  parseApiError,
  handleApiError,
  showErrorAlert,
  showSuccessAlert,
};
