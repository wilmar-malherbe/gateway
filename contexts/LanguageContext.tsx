import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Crypto from 'expo-crypto';
import { supabase } from '@/lib/supabase';

export type Language = 'afr' | 'eng';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

let sessionId: string | null = null;

const getSessionId = () => {
  if (!sessionId) {
    sessionId = Crypto.randomUUID();
  }
  return sessionId;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('afr');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const currentSessionId = getSessionId();

      const { data, error } = await supabase
        .from('user_preferences')
        .select('language')
        .eq('session_id', currentSessionId)
        .maybeSingle();

      if (error) {
        console.error('Error loading language preference:', error);
      } else if (data && (data.language === 'afr' || data.language === 'eng')) {
        setLanguageState(data.language);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      const currentSessionId = getSessionId();

      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            session_id: currentSessionId,
            language: lang,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'session_id',
          }
        );

      if (error) {
        console.error('Error saving language preference:', error);
      } else {
        setLanguageState(lang);
      }
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'afr' ? 'eng' : 'afr';
    setLanguage(newLanguage);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
