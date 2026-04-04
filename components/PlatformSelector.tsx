import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Video } from 'lucide-react-native';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { usePlatform } from '@/contexts/PlatformContext';

export function PlatformSelector() {
  const { platforms, selectedPlatform, setSelectedPlatform } = usePlatform();

  if (platforms.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {platforms.map((platform) => {
          const isSelected = selectedPlatform?.id === platform.id;
          return (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformButton,
                isSelected && styles.platformButtonActive,
              ]}
              onPress={() => setSelectedPlatform(platform)}
              activeOpacity={0.7}
            >
              <Video
                size={18}
                color={isSelected ? COLORS.white : COLORS.primary}
              />
              <Text
                style={[
                  styles.platformText,
                  isSelected && styles.platformTextActive,
                ]}
              >
                {platform.platform_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingTop: 0,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  platformButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  platformText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: COLORS.primary,
  },
  platformTextActive: {
    color: COLORS.white,
  },
});
