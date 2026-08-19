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
  const status = error.response?.status || error.status;
  const payload = error.response?.data || error;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to access this information.';
  if (status === 404) return 'The requested information could not be found.';
  if (status === 422) return 'Please check the information you entered and try again.';
  if (payload.code === 'AI_NOT_CONFIGURED') return 'AI features are not configured on this server.';
  if (payload.code === 'AI_PROVIDER_TIMEOUT') return 'The AI assistant took too long to respond. Please try again.';
  if (payload.code === 'AI_RATE_LIMITED') return 'The AI assistant is busy. Please try again shortly.';
  if (String(payload.code || '').startsWith('AI_')) return 'The AI assistant is temporarily unavailable. Please try again later.';
  if (status >= 500) return 'The service is temporarily unavailable. Please try again.';
  if (payload.message) return payload.message;
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
  const parsed = new Error(parseErrorMessage(error));
  parsed.status = error?.response?.status;
  parsed.code = error?.response?.data?.code;
  return parsed;
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
