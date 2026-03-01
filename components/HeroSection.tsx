import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="church" size={48} color={COLORS.white} />
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
  iconContainer: {
    marginBottom: SPACING.md,
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
