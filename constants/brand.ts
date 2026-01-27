// Seven Keys Brand Design Tokens
// Last updated: 2025-01-27

export const BrandColors = {
  deepBlue: '#09162E',
  platinum: '#E6E8EA',
  lightBlue: '#5684C4',
  black: '#000000',
  white: '#FFFFFF',
} as const;

export const BackgroundColors = {
  primary: '#09162E',      // Deep Blue - main background
  secondary: '#0D1829',    // Slightly lighter - cards, inputs
  cardBg: '#101D30',       // Card backgrounds
  overlay: 'rgba(9, 22, 46, 0.95)', // Modal overlays
} as const;

export const TextColors = {
  primary: '#E6E8EA',      // Platinum - main text
  secondary: '#A0A8B3',    // Muted - supporting text
  tertiary: '#5A6478',     // Dimmed - hints, disabled
  inverse: '#09162E',      // For light backgrounds
} as const;

export const AccentColors = {
  primary: '#5684C4',      // Light Blue - buttons, links, interactive
  primaryMuted: 'rgba(86, 132, 196, 0.15)', // Light blue with opacity for backgrounds
  reward: '#D4A574',       // Warm amber - points, rewards, celebrations
  rewardMuted: 'rgba(212, 165, 116, 0.15)', // Amber with opacity for backgrounds
  border: '#1A2844',       // Subtle borders
  borderLight: 'rgba(86, 132, 196, 0.2)', // Card borders (increased from 0.1 for better definition)
} as const;

export const StatusColors = {
  confirmed: '#22C55E',    // Green
  confirming: '#5684C4',   // Blue (was "pending")
  cancelled: '#EF4444',    // Red
  completed: '#6B7280',    // Gray
} as const;

export const Typography = {
  fontFamily: {
    light: 'BrittiSans-Light',
    regular: 'BrittiSans-Regular', 
    semibold: 'BrittiSans-Semibold',
    bold: 'BrittiSans-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 56,
  },
  // Line heights as multipliers
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  // Letter spacing for section headers
  letterSpacing: {
    tight: 0.5,
    normal: 1.2,
    wide: 2,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#5684C4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  rewardGlow: {
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
