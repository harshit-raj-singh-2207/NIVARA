/**
 * Form Validation Utilities for NIVARA frontend.
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email address is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return null;
};

export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return 'Full name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  return null;
};

export const validateCaregiverCode = (code) => {
  if (!code || !code.trim()) {
    return 'Caregiver code is required';
  }
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode.startsWith('CG-') && cleanCode.length < 6) {
    return 'Invalid caregiver code format (e.g. CG-A1B2C3)';
  }
  return null;
};

export const validatePhoneNumber = (phone) => {
  if (!phone) return null; // Optional
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone.trim())) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export default {
  validateEmail,
  validatePassword,
  validateFullName,
  validateCaregiverCode,
  validatePhoneNumber,
};
