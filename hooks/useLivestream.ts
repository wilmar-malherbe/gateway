import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Livestream {
  id: string;
  is_active: boolean;
  youtube_url: string | null;
  title: string | null;
  start_time: string | null;
}

export function useLivestream() {
  const [livestream, setLivestream] = useState<Livestream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLivestream();
    const subscription = supabase
      .channel('livestream_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'livestream' },
        () => {
          fetchLivestream();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLivestream = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('livestream')
        .select('*')
        .maybeSingle();

      if (err) throw err;
      setLivestream(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch livestream');
      console.error('Error fetching livestream:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchLivestream();
  };

  return { livestream, loading, error, refetch };
}
