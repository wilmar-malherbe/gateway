import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VideoPlatform } from '@/types/platform';
import { usePlatforms } from '@/hooks/usePlatforms';
import { supabase } from '@/lib/supabase';

interface PlatformContextType {
  selectedPlatform: VideoPlatform | null;
  setSelectedPlatform: (platform: VideoPlatform) => void;
  platforms: VideoPlatform[];
  loading: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

let sessionId: string | null = null;

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getSessionId = () => {
  if (!sessionId) {
    sessionId = generateUUID();
  }
  return sessionId;
};

export function PlatformProvider({ children }: { children: ReactNode }) {
  const { platforms, loading } = usePlatforms();
  const [selectedPlatform, setSelectedPlatformState] = useState<VideoPlatform | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (platforms.length > 0) {
      loadSelectedPlatform();
    }
  }, [platforms]);

  const loadSelectedPlatform = async () => {
    try {
      const currentSessionId = getSessionId();

      const { data, error } = await supabase
        .from('user_preferences')
        .select('selected_platform')
        .eq('session_id', currentSessionId)
        .maybeSingle();

      if (error) {
        console.error('Error loading platform preference:', error);
      } else if (data && data.selected_platform) {
        const platform = platforms.find(p => p.id === data.selected_platform);
        if (platform) {
          setSelectedPlatformState(platform);
          setIsLoaded(true);
          return;
        }
      }

      if (platforms.length > 0 && !selectedPlatform) {
        setSelectedPlatformState(platforms[0]);
      }
    } catch (error) {
      console.error('Failed to load platform preference:', error);
      if (platforms.length > 0) {
        setSelectedPlatformState(platforms[0]);
      }
    } finally {
      setIsLoaded(true);
    }
  };

  const setSelectedPlatform = async (platform: VideoPlatform) => {
    try {
      const currentSessionId = getSessionId();

      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            session_id: currentSessionId,
            selected_platform: platform.id,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'session_id',
          }
        );

      if (error) {
        console.error('Error saving platform preference:', error);
      } else {
        setSelectedPlatformState(platform);
      }
    } catch (error) {
      console.error('Failed to save platform preference:', error);
      setSelectedPlatformState(platform);
    }
  };

  if (!isLoaded && platforms.length > 0) {
    return null;
  }

  return (
    <PlatformContext.Provider
      value={{
        selectedPlatform,
        setSelectedPlatform,
        platforms,
        loading
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
