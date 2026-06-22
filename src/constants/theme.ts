export type ThemeMode = 'dark' | 'glass';

const darkColors = {
  background: '#0D0D0F',
  surface: '#1A1A2E',
  surface2: '#12121C',
  border: '#2A2837',
  accent: '#534AB7',
  accentLight: '#7F77DD',
  accentMuted: '#3C3489',
  textPrimary: '#F0EFF8',
  textSecondary: '#AFA9EC',
  textMuted: '#5A5580',
  success: '#4CAF82',
  warning: '#EF9F27',
  danger: '#E2544A',
};

const glassColors: typeof darkColors = {
  ...darkColors,
  surface: 'rgba(255,255,255,0.06)',
  surface2: 'rgba(255,255,255,0.03)',
  border: 'rgba(175,169,236,0.2)',
};

export const palettes: Record<ThemeMode, typeof darkColors> = {
  dark: darkColors,
  glass: glassColors,
};

export type Colors = typeof darkColors;

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  headingXL: { fontFamily: fontFamily.bold, fontSize: 32 },
  headingL: { fontFamily: fontFamily.bold, fontSize: 24 },
  headingM: { fontFamily: fontFamily.semibold, fontSize: 18 },
  body: { fontFamily: fontFamily.regular, fontSize: 15 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12 },
  label: { fontFamily: fontFamily.medium, fontSize: 13 },
} as const;

export const radius = {
  card: 20,
  button: 14,
  pill: 100,
  input: 12,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

export const theme = {
  colors: darkColors,
  fontFamily,
  typography,
  radius,
  spacing,
};

export type Theme = typeof theme;
