import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Service {
  id: string;
  day_of_week: string;
  service_time: string;
  description: string;
  capacity: number;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .order('service_time', { ascending: true });

      if (err) throw err;
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchServices();
  };

  return { services, loading, error, refetch };
}
