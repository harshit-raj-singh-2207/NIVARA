import lightTheme from './lightTheme';
import darkTheme from './darkTheme';
import highContrastTheme from './highContrastTheme';

export { lightTheme, darkTheme, highContrastTheme };

export const getTheme = (isDark = false, isHighContrast = false) => {
  if (isHighContrast) return highContrastTheme;
  return isDark ? darkTheme : lightTheme;
};
