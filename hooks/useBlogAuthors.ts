import { useState, useEffect } from 'react';
import { BlogAuthor, BlogApiResponse } from '@/types/blog';

const API_URL = 'https://nghelder.co.za/api/index.php/v1/mini/blog-authors';

export function useBlogAuthors() {
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch authors');
      }

      const result: BlogApiResponse<BlogAuthor> = await response.json();
      const activeAuthors = result.data.filter(author => author.state === 1);
      setAuthors(activeAuthors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return {
    authors,
    loading,
    error,
    refetch: fetchAuthors,
  };
}
