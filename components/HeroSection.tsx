import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/headerImage copy.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
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
    height: 120,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.light,
    color: COLORS.lightText,
    textAlign: 'center',
    fontWeight: '300',
  },
});
