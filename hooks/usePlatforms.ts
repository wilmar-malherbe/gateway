import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { VideoPlatform } from '@/types/platform';

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<VideoPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('video_platforms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setPlatforms(data || []);
    } catch (err) {
      console.error('Error fetching platforms:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch platforms');
    } finally {
      setLoading(false);
    }
  };

  return { platforms, loading, error, refetch: fetchPlatforms };
}
