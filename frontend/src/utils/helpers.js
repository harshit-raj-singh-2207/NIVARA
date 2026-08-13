/**
 * General purpose utility functions.
 * Pure functions with zero side-effects.
 */

/**
 * Generates a random alphanumeric ID (e.g., for local optimistic UI updates).
 * @param {number} length - Length of the ID to generate
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param {Function} func - The function to debounce
 * @param {number} wait - the number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * Useful for rate-limiting (e.g. scroll handlers, frequent location updates).
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to throttle invocations to
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Creates a deep clone of the provided object or array.
 * Note: Only safe for JSON-serializable data (no functions, Dates, undefined, Infinity).
 * @param {any} obj - The object to clone
 * @returns {any} - The deep cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Delays execution for a given number of milliseconds.
 * Useful for mocking API calls or creating artificial loading states.
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Safely accesses deeply nested properties in an object.
 * (Though optional chaining `?.` is preferred, this is useful when the path is dynamic).
 * @param {Object} obj - The object to query
 * @param {string[]} path - Array of string keys
 * @param {any} defaultValue - Value to return if the resolved value is undefined
 * @returns {any}
 */
export const get = (obj, path, defaultValue = undefined) => {
  const travel = (regexp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = typeof path === 'string' ? travel(/[,[\]]+?/) || travel(/[,[\].]+?/) : travel(/[,[\]]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};
