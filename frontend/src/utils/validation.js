export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase().trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const clean = String(phone).replace(/[\s\-()]/g, '');
  return clean.length >= 7 && clean.length <= 15;
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length >= 2;
};

export const isValidVerificationCode = (code) => {
  return typeof code === 'string' && /^\d{6}$/.test(code.trim());
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email || !isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password || !isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateRegisterForm = ({ name, email, password, confirmPassword, role }) => {
  const errors = {};
  if (!isValidName(name)) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!role) {
    errors.role = 'Please select a account role.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
