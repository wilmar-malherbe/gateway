import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Language } from '@/contexts/LanguageContext';

interface InspirationMessage {
  id: string;
  message_afr: string;
  message_eng: string;
}

export function useInspirationMessage(language: Language) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRandomMessage();
  }, []);

  const fetchRandomMessage = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('inspirational_messages')
        .select('*')
        .limit(100);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedMessage = data[randomIndex] as InspirationMessage;
        const messageText = language === 'afr' ? selectedMessage.message_afr : selectedMessage.message_eng;
        setMessage(messageText);
      }
    } catch (err) {
      console.error('Error fetching inspiration message:', err);
      setError('Failed to load message');
    } finally {
      setLoading(false);
    }
  };

  return { message, loading, error };
}
