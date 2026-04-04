import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoPlatform } from '@/types/platform';
import { usePlatforms } from '@/hooks/usePlatforms';

interface PlatformContextType {
  selectedPlatform: VideoPlatform | null;
  setSelectedPlatform: (platform: VideoPlatform) => void;
  platforms: VideoPlatform[];
  loading: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const PLATFORM_STORAGE_KEY = '@selected_platform';

export function PlatformProvider({ children }: { children: ReactNode }) {
  const { platforms, loading } = usePlatforms();
  const [selectedPlatform, setSelectedPlatformState] = useState<VideoPlatform | null>(null);

  useEffect(() => {
    loadSelectedPlatform();
  }, [platforms]);

  const loadSelectedPlatform = async () => {
    try {
      const stored = await AsyncStorage.getItem(PLATFORM_STORAGE_KEY);
      if (stored && platforms.length > 0) {
        const parsed = JSON.parse(stored);
        const platform = platforms.find(p => p.id === parsed.id);
        if (platform) {
          setSelectedPlatformState(platform);
          return;
        }
      }

      if (platforms.length > 0 && !selectedPlatform) {
        setSelectedPlatformState(platforms[0]);
      }
    } catch (error) {
      console.error('Error loading selected platform:', error);
      if (platforms.length > 0) {
        setSelectedPlatformState(platforms[0]);
      }
    }
  };

  const setSelectedPlatform = async (platform: VideoPlatform) => {
    try {
      setSelectedPlatformState(platform);
      await AsyncStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(platform));
    } catch (error) {
      console.error('Error saving selected platform:', error);
    }
  };

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
