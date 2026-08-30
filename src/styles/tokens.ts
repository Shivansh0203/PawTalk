/**
 * PawTalk Design Tokens - REFINED
 * Reduced purple saturation, warmer neutrals, more distinctive choices
 */

export const colors = {
  // Backgrounds
  background: {
    primary: '#0f1419', // Deep charcoal
    secondary: '#1a1f28', // Slightly lighter
    tertiary: '#252d38', // Elevated surfaces
    overlay: 'rgba(15, 20, 25, 0.8)',
  },

  // Accents - REDUCED SATURATION
  accent: {
    primary: '#8b5cf6', // Softer violet (not #9333ea)
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
  },

  // Supporting Colors - WARMER PALETTE
  semantic: {
    success: '#14b8a6', // Teal (warmer than green)
    warning: '#f59e0b', // Amber
    error: '#f87171', // Softer red
    info: '#38bdf8', // Sky blue
  },

  // Neutrals - WARMER WHITE
  neutral: {
    white: '#faf8f3', // Warm cream, not pure white
    gray900: '#1f2937',
    gray800: '#374151',
    gray700: '#4b5563',
    gray600: '#6b7280',
    gray500: '#9ca3af',
    gray400: '#d1d5db',
    gray300: '#e5e7eb',
  },

  // Text
  text: {
    primary: '#faf8f3', // Same as neutral.white
    secondary: '#d1d5db', // Gray 400
    tertiary: '#9ca3af', // Gray 500
    inverse: '#0f1419',
  },

  // Special
  lavender: '#ddd6fe',
  mutedBlue: '#7dd3fc',
};

export const typography = {
  fontFamily: {
    primary: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },

  fontSize: {
    // Display: Hero headlines
    display: {
      size: '3.5rem', // 56px
      lineHeight: '1.1',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },

    // H1: Page titles
    h1: {
      size: '2.5rem', // 40px
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },

    // H2: Section headers
    h2: {
      size: '1.875rem', // 30px
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },

    // H3: Subsection headers
    h3: {
      size: '1.5rem', // 24px
      lineHeight: '1.4',
      fontWeight: 600,
    },

    // Body: Primary reading text
    body: {
      size: '1rem', // 16px
      lineHeight: '1.6',
      fontWeight: 400,
    },

    // Body Small: Secondary information
    bodySm: {
      size: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: 400,
    },

    // Caption: Tertiary/helper text
    caption: {
      size: '0.75rem', // 12px
      lineHeight: '1.4',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },

    // Label: Button/input labels
    label: {
      size: '0.875rem', // 14px
      lineHeight: '1.4',
      fontWeight: 600,
    },
  },
};

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px - REDUCED from 1rem
  xl: '1rem', // 16px - REDUCED from 1.5rem
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  glow: '0 0 16px rgba(139, 92, 246, 0.25)', // Softer glow
};

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slowest: '500ms',
};

export const easing = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};
