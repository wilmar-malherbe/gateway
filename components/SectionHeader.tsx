import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, Fonts, SPACING } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    fontWeight: '400',
  },
});
