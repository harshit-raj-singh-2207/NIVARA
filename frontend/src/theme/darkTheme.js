import colors from '../constants/colors';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

export const darkTheme = {
  dark: true,
  colors: {
    background: colors.dark.background,
    surface: colors.dark.surface,
    card: colors.dark.card,
    text: colors.dark.textPrimary,
    subtext: colors.dark.textSecondary,
    border: colors.dark.border,
    primary: colors.dark.primary,
    primaryDark: colors.primary,
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

export default darkTheme;
