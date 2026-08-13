<<<<<<< HEAD
import { Alert } from 'react-native';

/**
 * Standardized error handling utilities.
 */

// ── Common Error Messages ───────────────────────────────
const FALLBACK_ERROR = 'Something went wrong. Please try again.';
const NETWORK_ERROR = 'Network error. Please check your connection and try again.';
const TIMEOUT_ERROR = 'The request took too long. Please try again.';
const UNAUTHORIZED_ERROR = 'Your session has expired. Please log in again.';

/**
 * Parses an unknown error object (from Axios, try/catch, or native module)
 * and returns a clean, user-friendly string message.
 * 
 * @param {any} error - The error caught in a try/catch block
 * @returns {string} - Clean error message for the UI
 */
export const getErrorMessage = (error) => {
  if (!error) return FALLBACK_ERROR;

  // 1. Axios / API Errors
  if (error.isAxiosError) {
    if (error.code === 'ECONNABORTED') {
      return TIMEOUT_ERROR;
    }
    if (!error.response) {
      // Network error (no response from server)
      return NETWORK_ERROR;
    }
    
    // Server responded with an error status
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 401) return UNAUTHORIZED_ERROR;
    
    // If backend provides a specific detail/message field
    if (data && typeof data === 'object') {
      if (typeof data.detail === 'string') return data.detail;
      if (typeof data.message === 'string') return data.message;
      
      // FastAPI Validation Error format: [{'msg': 'Field required', 'loc': ['body', 'name']}]
      if (Array.isArray(data.detail) && data.detail.length > 0 && data.detail[0].msg) {
        return data.detail.map(err => err.msg).join('; ');
      }
    }
    
    // Fallback based on common HTTP codes if no message provided
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status >= 500) return 'Server error. Our team has been notified.';
  }

  // 2. Standard JS Errors
  if (error instanceof Error) {
    // Hide ugly internal native module errors unless absolutely necessary
    if (error.message.includes('has not been initialized') || error.message.includes('Native module')) {
      return FALLBACK_ERROR;
    }
    return error.message;
  }

  // 3. String errors
  if (typeof error === 'string') {
    return error;
  }

  return FALLBACK_ERROR;
};

/**
 * Handles an error by parsing it and immediately showing a native Alert.
 * Useful for fire-and-forget interactions where we don't handle local state errors.
 * 
 * @param {any} error 
 * @param {string} [title="Error"] 
 */
export const showAlertError = (error, title = 'Error') => {
  const message = getErrorMessage(error);
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Specialized handler for BLE / GPS Band related errors
 * (often have esoteric hex codes that confuse users).
 * 
 * @param {any} error 
 * @returns {string} User-friendly BLE failure reason
 */
export const getBleErrorMessage = (error) => {
  const msg = getErrorMessage(error).toLowerCase();
  
  if (msg.includes('powered off') || msg.includes('power off')) {
    return 'Bluetooth is turned off. Please enable it in Settings.';
  }
  if (msg.includes('unauthorized') || msg.includes('permission')) {
    return 'Nivara needs Bluetooth permission to connect to the band.';
  }
  if (msg.includes('timeout') || msg.includes('not found') || msg.includes('disconnected')) {
    return 'Could not find the GPS Band. Ensure it is turned on and nearby.';
  }
  if (msg.includes('characteristic') || msg.includes('service')) {
    return 'Incompatible device. This band does not support the required safety features.';
  }
  
  return msg; // fallback to standard parsed message
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
};
