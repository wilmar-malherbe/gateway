import { useState, useEffect } from 'react';
import { BlogArticle, BlogApiResponse } from '@/types/blog';

const API_URL = 'https://nghelder.co.za/api/index.php/v1/mini/blog-content';

export function useBlogContent() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const result: BlogApiResponse<BlogArticle> = await response.json();
      const publishedArticles = result.data.filter(article => article.state === 1);
      setArticles(publishedArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
  };
}
