/**
<<<<<<< HEAD
 * Date and time utility functions.
 * Using native JS APIs to reduce bundle size instead of moment.js or date-fns.
 */

/**
 * Returns today's date at midnight for easy date comparisons.
 * @returns {Date}
 */
export const getStartOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Formats an ISO date string into a user-friendly time string (e.g. "2:30 PM")
 * @param {string|Date} isoString 
 * @returns {string}
 */
export const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
=======
 * Date & Time Utilities for NIVARA frontend.
 * Formats timestamps for chat messages, task timelines, and routine schedules.
 */

/**
 * Formats a Date object or ISO string to relative time (e.g., "Just now", "5m ago", "2h ago", "Yesterday").
 * @param {Date|string|number} dateInput - Date value to format
 * @returns {string} Relative formatted time string
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

/**
 * Formats date object or ISO string into 12-hour format time (e.g., "10:45 AM").
 * @param {Date|string|number} dateInput
 * @returns {string}
 */
export const formatTime12Hour = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleTimeString(undefined, {
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
<<<<<<< HEAD
 * Formats an ISO date string into a user-friendly date string (e.g. "Oct 12, 2024")
 * @param {string|Date} isoString 
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
=======
 * Formats date object or ISO string into full readable date string (e.g. "Monday, Aug 12, 2026").
 * @param {Date|string|number} dateInput
 * @returns {string}
 */
export const formatDateFull = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
<<<<<<< HEAD
 * Formats an ISO date string into a relative time string.
 * Examples: "Just now", "5m ago", "2h ago", "Yesterday", or falls back to standard date.
 * @param {string|Date} isoString 
 * @returns {string}
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return `Yesterday, ${formatTime(date)}`;
  }
  
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return formatDate(date);
};

/**
 * Calculates time remaining until a target ISO string date.
 * Returns formatted string: "X hrs Y mins" or "Expired"
 * @param {string|Date} targetIsoString 
 * @returns {string}
 */
export const getTimeRemaining = (targetIsoString) => {
  if (!targetIsoString) return '';
  
  const target = new Date(targetIsoString);
  const now = new Date();
  const diffMs = target - now;
  
  if (diffMs <= 0) return 'Expired';
  
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
=======
 * Formats a duration in seconds into MM:SS format.
 * @param {number} seconds
 * @returns {string}
 */
export const formatDurationMMSS = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Checks if a given date is today.
 * @param {Date|string|number} dateInput
 * @returns {boolean}
 */
export const isToday = (dateInput) => {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export default {
  formatRelativeTime,
  formatTime12Hour,
  formatDateFull,
  formatDurationMMSS,
  isToday,
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
};
