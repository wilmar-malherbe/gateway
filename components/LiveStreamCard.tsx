import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Play, Eye } from 'lucide-react-native';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { YouTubeVideo } from '@/types/youtube';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';

interface LiveStreamCardProps {
  video: YouTubeVideo;
  onPress: () => void;
}

const formatViewers = (viewers: number): string => {
  if (viewers >= 1000000) {
    return `${(viewers / 1000000).toFixed(1)}M`;
  }
  if (viewers >= 1000) {
    return `${(viewers / 1000).toFixed(1)}K`;
  }
  return viewers.toString();
};

export function LiveStreamCard({ video, onPress }: LiveStreamCardProps) {
  const { language } = useLanguage();
  const t = translate(language);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const viewers = video.live_viewer_count > 0
    ? formatViewers(video.live_viewer_count)
    : '0';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <Animated.View
          style={[
            styles.liveBadge,
            {
              transform: [{ scale: pulseAnim }],
            }
          ]}
        >
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{t.videos.live}</Text>
        </Animated.View>

        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Play size={32} color={COLORS.white} fill={COLORS.white} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.liveNowContainer}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveNowText}>{t.videos.liveNow}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        {video.live_viewer_count > 0 && (
          <View style={styles.viewersContainer}>
            <Eye size={16} color={COLORS.error} />
            <Text style={styles.viewersText}>
              {viewers} {t.videos.viewers}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.watchButton} onPress={onPress}>
          <Play size={18} color={COLORS.white} fill={COLORS.white} />
          <Text style={styles.watchButtonText}>{t.videos.watchVideo}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.error,
    ...SHADOWS.large,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: COLORS.border,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
    ...SHADOWS.medium,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  liveText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  content: {
    padding: SPACING.xl,
  },
  liveNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
  },
  liveNowText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: COLORS.error,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 28,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  viewersText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: COLORS.error,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  watchButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: COLORS.white,
  },
});
