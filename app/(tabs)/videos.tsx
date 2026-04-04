import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, Fonts, SPACING } from '@/constants/theme';
import { StickyHeader } from '@/components/StickyHeader';
import { VideoCard } from '@/components/VideoCard';
import { LiveStreamCard } from '@/components/LiveStreamCard';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';
import { YouTubeVideo } from '@/types/youtube';
import { RefreshCw } from 'lucide-react-native';

export default function VideosScreen() {
  const { videos, liveStream, loading, error, refreshing, refresh } = useYouTubeVideos();
  const { language } = useLanguage();
  const t = translate(language);

  const openVideo = (videoId: string) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(youtubeUrl).catch(err => {
      console.error('Error opening YouTube video:', err);
    });
  };

  const renderVideo = ({ item }: { item: YouTubeVideo }) => (
    <VideoCard video={item} onPress={() => openVideo(item.video_id)} />
  );

  const renderHeader = () => {
    if (!liveStream) return null;

    return (
      <View style={styles.liveStreamContainer}>
        <LiveStreamCard
          video={liveStream}
          onPress={() => openVideo(liveStream.video_id)}
        />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t.videos.error}</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <RefreshCw size={18} color={COLORS.white} />
            <Text style={styles.retryButtonText}>{t.videos.retry}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{t.videos.noVideos}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StickyHeader title={t.videos.title} />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{t.videos.loading}</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={(item) => item.video_id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  liveStreamContainer: {
    marginBottom: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl * 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: COLORS.white,
  },
});
