/**
 * NIVARA Typography Tokens and Dynamic Scaling.
 * Enables user-controlled text scaling for reading accessibility and visual comfort.
 */

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  h3: 28,
  h2: 32,
  h1: 38,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Computes font sizes scaled by dynamic user preference multiplier (e.g. 0.8x to 2.0x).
 * @param {number} scaleMultiplier - Dynamic scale factor (default 1.0)
 */
export const getScaledTypography = (scaleMultiplier = 1.0) => {
  const scale = Math.max(0.8, Math.min(scaleMultiplier, 2.0));
  
  return {
    sizes: {
      xs: Math.round(FONT_SIZES.xs * scale),
      sm: Math.round(FONT_SIZES.sm * scale),
      md: Math.round(FONT_SIZES.md * scale),
      lg: Math.round(FONT_SIZES.lg * scale),
      xl: Math.round(FONT_SIZES.xl * scale),
      xxl: Math.round(FONT_SIZES.xxl * scale),
      h3: Math.round(FONT_SIZES.h3 * scale),
      h2: Math.round(FONT_SIZES.h2 * scale),
      h1: Math.round(FONT_SIZES.h1 * scale),
    },
    weights: FONT_WEIGHTS,
    lineHeights: LINE_HEIGHTS,
  };
};

export default {
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  getScaledTypography,
};
