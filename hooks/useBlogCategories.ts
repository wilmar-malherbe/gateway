import { useState, useEffect } from 'react';
import { BlogCategory, BlogApiResponse } from '@/types/blog';

const API_URL = 'https://nghelder.co.za/api/index.php/v1/mini/blog-categories';

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result: BlogApiResponse<BlogCategory> = await response.json();
      const activeCategories = result.data.filter(category => category.state === 1);
      setCategories(activeCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
