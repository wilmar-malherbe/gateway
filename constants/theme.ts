/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const COLORS = {
  primary: '#0d2262',
  secondary: '#394462',
  white: '#ffffff',
  text: '#1a1a1a',
  lightText: '#666666',
  background: '#f5f5f5',
  border: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

export const Colors = {
  light: {
    text: COLORS.text,
    background: COLORS.white,
    tint: COLORS.primary,
    icon: COLORS.lightText,
    tabIconDefault: COLORS.lightText,
    tabIconSelected: COLORS.primary,
  },
  dark: {
    text: COLORS.white,
    background: '#1a1a1a',
    tint: COLORS.primary,
    icon: COLORS.lightText,
    tabIconDefault: COLORS.lightText,
    tabIconSelected: COLORS.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    thin: 'Montserrat_100Thin',
    light: 'Montserrat_300Light',
    regular: 'Montserrat_400Regular',
    semibold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
  },
  default: {
    thin: 'Montserrat_100Thin',
    light: 'Montserrat_300Light',
    regular: 'Montserrat_400Regular',
    semibold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
  },
  web: {
    thin: "Montserrat, sans-serif",
    light: "Montserrat, sans-serif",
    regular: "Montserrat, sans-serif",
    semibold: "Montserrat, sans-serif",
    bold: "Montserrat, sans-serif",
  },
});

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};
