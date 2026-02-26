import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  GestureResponderEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ActionButtonProps {
  label: string;
  icon: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function ActionButton({
  label,
  icon,
  onPress,
  loading = false,
  variant = 'primary',
  fullWidth = false,
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.primary} />
      ) : (
        <View style={styles.content}>
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={isPrimary ? COLORS.white : COLORS.primary}
          />
          <Text
            style={[
              styles.label,
              isPrimary && styles.primaryLabel,
              isSecondary && styles.secondaryLabel,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    ...SHADOWS.small,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  fullWidth: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    fontWeight: '600',
  },
  primaryLabel: {
    color: COLORS.white,
  },
  secondaryLabel: {
    color: COLORS.primary,
  },
});
