import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, Fonts, SPACING } from '@/constants/theme';
import { SectionHeader } from '@/components/SectionHeader';
import { BlogCard } from '@/components/BlogCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { useBlogContent } from '@/hooks/useBlogContent';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { useBlogAuthors } from '@/hooks/useBlogAuthors';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';

export default function NewsScreen() {
  const { language } = useLanguage();
  const t = translate(language);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { articles, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = useBlogContent();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useBlogCategories();
  const { authors, refetch: refetchAuthors } = useBlogAuthors();

  const filteredArticles = useMemo(() => {
    if (selectedCategoryId === null) {
      return articles;
    }
    return articles.filter(article => article.cat_id === selectedCategoryId);
  }, [articles, selectedCategoryId]);

  const onRefresh = async () => {
    await Promise.all([refetchArticles(), refetchCategories(), refetchAuthors()]);
  };

  const handleArticlePress = (articleId: number) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const author = authors.find(a => a.id === article.author_id);
    const category = categories.find(c => c.id === article.cat_id);

    router.push({
      pathname: '/article-detail',
      params: {
        id: article.id,
        title: article.title,
        description: article.description,
        featured_image: article.featured_image || '',
        read_time: article.read_time,
        created: article.created,
        author_name: author?.title || '',
        author_designation: author?.designation || '',
        author_bio: author?.author_bio || '',
        author_image: author?.profile_image || '',
        category_name: category?.title || '',
      },
    });
  };

  const isLoading = articlesLoading || categoriesLoading;
  const isRefreshing = !isLoading && (articlesLoading || categoriesLoading);

  if (isLoading && articles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{t.news.loading}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (articlesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{t.news.error}</Text>
          <Text style={styles.errorText}>{articlesError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <SectionHeader title={t.news.title} />
            </View>
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              allText={t.news.allCategories}
            />
          </>
        }
        renderItem={({ item }) => {
          const author = authors.find(a => a.id === item.author_id);
          const category = categories.find(c => c.id === item.cat_id);
          return (
            <BlogCard
              article={item}
              author={author}
              categoryName={category?.title}
              onPress={() => handleArticlePress(item.id)}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.news.noArticles}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: 0,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    textAlign: 'center',
  },
});
