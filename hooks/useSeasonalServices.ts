import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ServiceTime {
  id: string;
  service_name_afr: string;
  service_name_eng: string;
  service_time: string;
  venue: string;
  season: 'summer' | 'winter';
  display_order: number;
  is_active: boolean;
}

export interface SeasonConfig {
  is_summer: boolean;
  description?: string;
}

export function useSeasonalServices() {
  const [services, setServices] = useState<ServiceTime[]>([]);
  const [seasonConfig, setSeasonConfig] = useState<SeasonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasonalServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: configData, error: configError } = await supabase
        .from('season_config')
        .select('is_summer, description')
        .maybeSingle();

      if (configError) throw configError;

      if (!configData) {
        throw new Error('Season configuration not found');
      }

      setSeasonConfig(configData);

      const currentSeason = configData.is_summer ? 'summer' : 'winter';

      const { data: servicesData, error: servicesError } = await supabase
        .from('service_times')
        .select('*')
        .eq('season', currentSeason)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (servicesError) throw servicesError;

      setServices(servicesData || []);
    } catch (err) {
      console.error('Error fetching seasonal services:', err);
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasonalServices();
  }, []);

  return {
    services,
    seasonConfig,
    loading,
    error,
    refetch: fetchSeasonalServices,
  };
}
