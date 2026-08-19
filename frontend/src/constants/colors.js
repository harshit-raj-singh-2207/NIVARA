/**
 * NIVARA Sensory-Friendly Color Tokens & Palettes.
 * Features high-contrast modes, soft soothing palettes for neurodivergent sensory comfort,
 * and high-visibility status indicators.
 */

export const PALETTE = {
  // Primary brand colors (warm plum)
  primary: {
    50: '#F5EFF2',
    100: '#EADDE3',
    500: '#6D4C5B', // Main Action Buttons, Headers
    700: '#593C49',
    900: '#3F2A34',
  },

  // Sensory-Soothing Soft Colors (Low Overload / Gentle Contrast)
  sensory: {
    soothingSage: '#E8EFE6',
    softTeal: '#EEF2EA',
    lavenderMuted: '#F3EAED',
    warmCream: '#FAF7F2',
    mutedGray: '#FAF7F2',
  },

  // Safety & Alert Colors (High Visibility)
  safety: {
    sosRed: '#C76B67',
    sosRedLight: '#F8E8E6',
    warningAmber: '#D5A45A',
    safeGreen: '#6F9674',
    infoBlue: '#8FA58A',
  },

  // Neutrals (High Readability & Accessibility)
  neutral: {
    surfaceLight: '#FFFFFF',
    surfaceDark: '#121212',
    textPrimary: '#302B2D',
    textSecondary: '#766D70',
    textDisabled: '#A69C9F',
    border: '#E7DED8',
  },
};

export const THEME = {
  light: {
    background: PALETTE.sensory.mutedGray,
    surface: PALETTE.neutral.surfaceLight,
    primary: PALETTE.primary[500],
    text: PALETTE.neutral.textPrimary,
    subtext: PALETTE.neutral.textSecondary,
    border: PALETTE.neutral.border,
    sos: PALETTE.safety.sosRed,
    safeZone: PALETTE.safety.safeGreen,
    warning: PALETTE.safety.warningAmber,
  },
  
  // Sensory Overload Reduction Mode (Dark Soft Contrast)
  sensoryCalm: {
    background: '#18181B',
    surface: '#27272A',
    primary: '#60A5FA',
    text: '#F4F4F5',
    subtext: '#A1A1AA',
    border: '#3F3F46',
    sos: '#EF4444',
    safeZone: '#34D399',
    warning: '#FBBF24',
  },
};

export const BRAND_COLORS = {
  primary: '#6D4C5B',
  primaryLight: '#EADDE3',
  primaryDark: '#593C49',
  secondary: '#8FA58A',
  secondaryLight: '#DCE7D9',
  accent: '#D98B73',
  purple: '#876878',
  pink: '#C98283',
};

export const SENSORY_PALETTES = {
  light: {
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceSubtle: '#F6F1EC',
    text: '#302B2D',
    textSecondary: '#766D70',
    textMuted: '#8B8184',
    border: '#E7DED8',
    borderFocus: '#6D4C5B',
    divider: '#EEE7E2',
    cardBackground: '#FFFFFF',
    cardBorder: '#E7DED8',
    inputBackground: '#FFFFFF',
    overlay: 'rgba(48, 43, 45, 0.42)',
    shadow: '#6D5B62',
  },
  dark: {
    background: '#211C1E',
    surface: '#30282C',
    surfaceSubtle: '#3C3236',
    text: '#FAF7F2',
    textSecondary: '#D8CED1',
    textMuted: '#B0A4A7',
    border: '#52464B',
    borderFocus: '#D7BFC9',
    divider: '#463B40',
    cardBackground: '#30282C',
    cardBorder: '#52464B',
    inputBackground: '#292225',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: '#000000',
  },
  high_contrast: {
    background: '#000000',
    surface: '#121212',
    surfaceSubtle: '#262626',
    text: '#FFFFFF',
    textSecondary: '#FFFF00', // High-visibility contrast Yellow
    textMuted: '#FFFFFF',
    border: '#FFFFFF',
    borderFocus: '#FFFF00',
    divider: '#FFFFFF',
    cardBackground: '#000000',
    cardBorder: '#FFFF00',
    inputBackground: '#1A1A1A',
    overlay: 'rgba(0, 0, 0, 0.9)',
    shadow: '#FFFF00',
  },
};

export const STATUS_COLORS = {
  success: '#6F9674',
  successBackground: '#E8F0E7',
  warning: '#D5A45A',
  warningBackground: '#FAF0DD',
  error: '#C76B67',
  errorBackground: '#F8E8E6',
  info: '#8FA58A',
  infoBackground: '#E8EFE6',
};

// AAC Quick Communication Buttons Colors
export const AAC_BUTTON_COLORS = {
  needHelp: '#A95657',
  needSpace: '#B56F59',
  cantSpeak: '#6D4C5B',
  yes: '#6F9674',
  no: '#B97862',
};

export default {
  PALETTE,
  THEME,
  BRAND_COLORS,
  SENSORY_PALETTES,
  STATUS_COLORS,
  AAC_BUTTON_COLORS,
};
