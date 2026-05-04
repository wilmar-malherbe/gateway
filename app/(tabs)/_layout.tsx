import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { LiquidTabBar } from '@/components/LiquidTabBar';
import { StickyHeader } from '@/components/StickyHeader';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { session, initialized } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <StickyHeader />
      </View>
      <Tabs
        tabBar={(props) => <LiquidTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="videos"
          options={{
            title: 'Videos',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="play.rectangle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="ellipsis.circle.fill" color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
  },
});
