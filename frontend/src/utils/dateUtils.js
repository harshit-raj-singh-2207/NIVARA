/**
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
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Formats an ISO date string into a user-friendly date string (e.g. "Oct 12, 2024")
 * @param {string|Date} isoString 
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
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
};
