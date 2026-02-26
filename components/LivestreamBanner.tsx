import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface LivestreamBannerProps {
  isActive: boolean;
  youtubeUrl?: string;
  title?: string;
}

export function LivestreamBanner({ isActive, youtubeUrl, title }: LivestreamBannerProps) {
  if (!isActive) {
    return null;
  }

  const handlePress = () => {
    if (youtubeUrl) {
      Linking.openURL(youtubeUrl).catch(() => {
        console.log('Failed to open YouTube URL');
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.title}>{title || 'Watch Live Service'}</Text>
        <Text style={styles.subtitle}>Join us now on YouTube</Text>
      </View>
      <MaterialCommunityIcons name="play-circle" size={32} color={COLORS.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#e74c3c',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    marginRight: SPACING.md,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  liveText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#f5f5f5',
    fontWeight: '400',
  },
});
