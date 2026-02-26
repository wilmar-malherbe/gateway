import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ContactInfo {
  id: string;
  department: string;
  phone_number: string;
  email: string | null;
  hours_of_operation: string | null;
}

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('contact_info')
        .select('*')
        .eq('department', 'Front Office')
        .maybeSingle();

      if (err) throw err;
      setContactInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact info');
      console.error('Error fetching contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchContactInfo();
  };

  return { contactInfo, loading, error, refetch };
}
