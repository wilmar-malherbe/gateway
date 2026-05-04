import { useFrameworkReady } from '@/hooks/useFrameworkReady'import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import {
  Montserrat_100Thin,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PlatformProvider } from '@/contexts/PlatformContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

function AuthRedirect() {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    setNavReady(true);
  }, []);

  useEffect(() => {
    if (!initialized || !navReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments, navReady]);

  return null;
}

function SplashGate() {
  const { initialized } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat_100Thin': Montserrat_100Thin,
    'Montserrat_300Light': Montserrat_300Light,
    'Montserrat_400Regular': Montserrat_400Regular,
    'Montserrat_600SemiBold': Montserrat_600SemiBold,
    'Montserrat_700Bold': Montserrat_700Bold,
  });

  const isReady = (fontsLoaded || !!fontError) && initialized;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return null;
}

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <LanguageProvider>
        <PlatformProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <SplashGate />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="article-detail" />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <AuthRedirect />
            <StatusBar style="auto" />
          </ThemeProvider>
        </PlatformProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
