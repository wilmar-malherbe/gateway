import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react-native';
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const cleanPath = imagePath.split('#')[0];
  return `https://nghelder.co.za/${cleanPath}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function ArticleDetailScreen() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const article = {
    id: Number(params.id),
    title: params.title as string,
    description: params.description as string,
    featured_image: params.featured_image as string,
    read_time: Number(params.read_time),
    created: params.created as string,
    author_name: params.author_name as string,
    author_designation: params.author_designation as string,
    author_bio: params.author_bio as string,
    author_image: params.author_image as string,
    category_name: params.category_name as string,
  };

  const imageUrl = getImageUrl(article.featured_image);
  const authorImageUrl = article.author_image ? getImageUrl(article.author_image) : '';
  const plainContent = stripHtmlTags(article.description);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.featuredImage, { width }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderImage, { width }]}>
            <Text style={styles.placeholderText}>NG Helder</Text>
          </View>
        )}

        <View style={styles.content}>
          {article.category_name && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category_name}</Text>
            </View>
          )}

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={COLORS.lightText} />
              <Text style={styles.metaText}>{formatDate(article.created)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color={COLORS.lightText} />
              <Text style={styles.metaText}>{article.read_time} min read</Text>
            </View>
          </View>

          {article.author_name && (
            <View style={styles.authorCard}>
              {authorImageUrl ? (
                <Image source={{ uri: authorImageUrl }} style={styles.authorImage} />
              ) : (
                <View style={styles.authorImagePlaceholder}>
                  <User size={24} color={COLORS.lightText} />
                </View>
              )}
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{article.author_name}</Text>
                {article.author_designation && (
                  <Text style={styles.authorDesignation}>{article.author_designation}</Text>
                )}
                {article.author_bio && (
                  <Text style={styles.authorBio}>{stripHtmlTags(article.author_bio)}</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.body}>{plainContent}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
  },
  featuredImage: {
    height: 300,
    backgroundColor: COLORS.border,
  },
  placeholderImage: {
    height: 300,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: COLORS.white,
  },
  content: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    lineHeight: 32,
  },
  metadata: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
  },
  authorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  authorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  authorImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  authorDesignation: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  authorBio: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xl,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.text,
    lineHeight: 26,
  },
});
