import colors from '../constants/colors';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

export const lightTheme = {
  dark: false,
  colors: {
    background: colors.background,
    surface: colors.surface,
    card: colors.card,
    text: colors.textPrimary,
    subtext: colors.textSecondary,
    border: colors.border,
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    accent: colors.accent,
    danger: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  typography,
  spacing,
};

export default lightTheme;
