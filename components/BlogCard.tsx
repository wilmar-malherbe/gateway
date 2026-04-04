import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, User } from 'lucide-react-native';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { BlogArticle, BlogAuthor } from '@/types/blog';

interface BlogCardProps {
  article: BlogArticle;
  author?: BlogAuthor;
  categoryName?: string;
  onPress: () => void;
}

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const cleanPath = imagePath.split('#')[0];
  return `https://nghelder.co.za/${cleanPath}`;
};

export function BlogCard({ article, author, categoryName, onPress }: BlogCardProps) {
  const plainDescription = stripHtmlTags(article.description);
  const truncatedDescription = plainDescription.length > 150
    ? plainDescription.substring(0, 150) + '...'
    : plainDescription;

  const imageUrl = getImageUrl(article.featured_image);
  const authorImageUrl = author?.profile_image ? getImageUrl(author.profile_image) : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>NG Helder</Text>
        </View>
      )}

      <View style={styles.content}>
        {categoryName && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryName}</Text>
          </View>
        )}

        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {truncatedDescription}
        </Text>

        <View style={styles.footer}>
          <View style={styles.authorSection}>
            {authorImageUrl ? (
              <Image
                source={{ uri: authorImageUrl }}
                style={styles.authorImage}
              />
            ) : (
              <View style={styles.authorImagePlaceholder}>
                <User size={16} color={COLORS.lightText} />
              </View>
            )}
            <View style={styles.authorInfo}>
              <Text style={styles.authorName} numberOfLines={1}>
                {author?.title || 'Unknown'}
              </Text>
              {author?.designation && (
                <Text style={styles.authorDesignation} numberOfLines={1}>
                  {author.designation}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.readTimeContainer}>
            <Clock size={14} color={COLORS.lightText} />
            <Text style={styles.readTime}>{article.read_time} min</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.border,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: COLORS.white,
  },
  content: {
    padding: SPACING.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  authorImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
  },
  authorDesignation: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    marginTop: 2,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  readTime: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
  },
});
