import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, Fonts, SPACING } from '@/constants/theme';

export default function VideosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Videos</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    fontWeight: '400',
  },
});
