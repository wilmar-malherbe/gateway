import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://ccriverside.org/wp-content/uploads/2019/11/logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  logo: {
    width: 120,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.light,
    color: '#e8eef7',
    textAlign: 'center',
    fontWeight: '300',
  },
});
