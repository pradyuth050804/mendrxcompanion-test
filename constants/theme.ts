export const colors = {
  primary: '#1B3B2B', // Deep Moss Green
  primaryLight: '#E8F0EC', // Soft Sage Green
  secondary: '#8FAB99', // Muted Sage
  background: '#F0F4F2', // Slightly darker tinted background for contrast
  card: '#FFFFFF',
  text: {
    primary: '#111A15', // Dark Charcoal Slate
    secondary: '#55635C', // Muted Slate Grey
    light: '#8C9C94', // Caption Grey
  },
  success: '#287D4B', // Forest Success
  warning: '#EFA94A', // Warm Amber Gold
  error: '#E25C5C', // Soft Crimson
  border: '#D9E0DD', // Darker border for cards to stand out
  accent: '#EADAC9', // Warm Wheat Cream
  coral: '#FF724C', // Active Coral Orange
  lavender: '#7A5CFA', // Mindfulness Lavender
  gold: '#F2B84B', // Sunny Gold
  white: '#FFFFFF',
  // New vibrant colors added for better differentiation
  cyan: '#00B4D8',
  pink: '#F72585',
  lime: '#A7C957',
  indigo: '#3F37C9',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#12251B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#12251B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#12251B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  premium: {
    shadowColor: '#12251B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 8,
  },
};

export const typography = {
  display: {
    fontSize: 42,
    fontWeight: '800' as const,
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodyMedium: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
  },
  small: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
};

