import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface InfoCardProps {
  icon: string;
  title: string;
  content: string;
  onPress?: () => void;
  isClickable?: boolean;
}

export function InfoCard({ icon, title, content, onPress, isClickable = false }: InfoCardProps) {
  const handlePress = () => {
    if (isClickable && onPress) {
      onPress();
    }
  };

  const Component = isClickable ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.card, isClickable && styles.clickable]}
      onPress={isClickable ? handlePress : undefined}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon as any} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{content}</Text>
      </View>
      {isClickable && (
        <MaterialCommunityIcons name={'chevron-right' as any} size={24} color={COLORS.primary} />
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  clickable: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  text: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    fontWeight: '400',
  },
});
