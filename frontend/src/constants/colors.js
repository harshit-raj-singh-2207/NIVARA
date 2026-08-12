/**
 * NIVARA Sensory-Friendly Color Tokens & Palettes.
 * Features high-contrast modes, soft soothing palettes for neurodivergent sensory comfort,
 * and high-visibility status indicators.
 */

export const PALETTE = {
  // Primary Brand Colors (Calming & Trustworthy Blues)
  primary: {
    50: '#F0F7FF',
    100: '#E0EFFE',
    500: '#2563EB', // Main Action Buttons, Headers
    700: '#1D4ED8',
    900: '#1E3A8A',
  },

  // Sensory-Soothing Soft Colors (Low Overload / Gentle Contrast)
  sensory: {
    soothingSage: '#E2EFCB',   // Calming state background
    softTeal: '#E0F2FE',       // Sensory comfort badge
    lavenderMuted: '#EDE9FE',  // Social/Communication cards
    warmCream: '#FFFBEB',      // Low-contrast reading view
    mutedGray: '#F3F4F6',      // Background neutral
  },

  // Safety & Alert Colors (High Visibility)
  safety: {
    sosRed: '#DC2626',         // Emergency SOS Hold Button
    sosRedLight: '#FEE2E2',    // SOS Active Banner Background
    warningAmber: '#F59E0B',  // Geofence / RSSI Low Signal
    safeGreen: '#10B981',     // Connected Band / Inside Safe Zone
    infoBlue: '#3B82F6',      // Status Updates
  },

  // Neutrals (High Readability & Accessibility)
  neutral: {
    surfaceLight: '#FFFFFF',
    surfaceDark: '#121212',
    textPrimary: '#1F2937',   // WCAG Compliant High Contrast
    textSecondary: '#6B7280', // Muted Subtitles
    textDisabled: '#9CA3AF',
    border: '#E5E7EB',
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
  primary: '#4F46E5', // Deep Indigo
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',
  secondary: '#10B981', // Soothing Teal/Emerald
  secondaryLight: '#34D399',
  accent: '#F59E0B', // Soft Warm Amber
  purple: '#8B5CF6',
  pink: '#EC4899',
};

export const SENSORY_PALETTES = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderFocus: '#6366F1',
    divider: '#EDF2F7',
    cardBackground: '#FFFFFF',
    cardBorder: '#E2E8F0',
    inputBackground: '#F8FAFC',
    overlay: 'rgba(15, 23, 42, 0.4)',
    shadow: '#64748B',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSubtle: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    border: '#334155',
    borderFocus: '#818CF8',
    divider: '#1E293B',
    cardBackground: '#1E293B',
    cardBorder: '#334155',
    inputBackground: '#0F172A',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: '#000000',
  },
  high_contrast: {
    background: '#000000',
    surface: '#121212',
    surfaceSubtle: '#262626',
    text: '#FFFFFF',
    textSecondary: '#FFFF00', // High-visibility contrast Yellow
    textMuted: '#00FFFF', // Cyan
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
  success: '#10B981',
  successBackground: '#D1FAE5',
  warning: '#F59E0B',
  warningBackground: '#FEF3C7',
  error: '#EF4444',
  errorBackground: '#FEE2E2',
  info: '#3B82F6',
  infoBackground: '#DBEAFE',
};

// AAC Quick Communication Buttons Colors
export const AAC_BUTTON_COLORS = {
  needHelp: '#EF4444', // Red
  needSpace: '#F59E0B', // Amber
  cantSpeak: '#8B5CF6', // Purple
  yes: '#10B981', // Green
  no: '#F97316', // Orange
};

export default {
  PALETTE,
  THEME,
  BRAND_COLORS,
  SENSORY_PALETTES,
  STATUS_COLORS,
  AAC_BUTTON_COLORS,
};
