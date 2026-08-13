/**
 * High Contrast Theme Object for NIVARA (WCAG AAA sensory accessibility).
 */

import { BRAND_COLORS, SENSORY_PALETTES, STATUS_COLORS } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

export const highContrastTheme = {
  mode: 'high_contrast',
  colors: {
    ...BRAND_COLORS,
    ...SENSORY_PALETTES.high_contrast,
    status: STATUS_COLORS,
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: {
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
  },
  shadows: {
    small: {
      shadowColor: '#FFFF00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 4,
    },
    medium: {
      shadowColor: '#FFFF00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 4,
      elevation: 8,
    },
    large: {
      shadowColor: '#FFFF00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1.0,
      shadowRadius: 8,
      elevation: 12,
    },
  },
};

export default highContrastTheme;
