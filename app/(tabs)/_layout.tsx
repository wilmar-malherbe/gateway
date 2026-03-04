import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { LiquidTabBar } from '@/components/LiquidTabBar';
import { StickyHeader } from '@/components/StickyHeader';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <SafeAreaView style={styles.container}>
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
