/**
 * Theme barrel export.
 * Re-exports both themes and provides a simple hook for theme access.
 */

export { lightTheme } from './lightTheme';
export { darkTheme } from './darkTheme';

/**
 * For now, the app uses lightTheme everywhere.
 * When dark mode support is added (Part 4), this will read from
 * a ThemeContext or the user's system preference.
 */
export const getTheme = () => {
  // TODO: check user preference / system color scheme
  return require('./lightTheme').lightTheme;
};
