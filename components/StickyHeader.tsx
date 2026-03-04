import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageSelector } from './LanguageSelector';
import { COLORS, SPACING, SHADOWS } from '@/constants/theme';

export function StickyHeader() {
  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={require('@/assets/images/headerImage copy.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.centerSection}>
        <LanguageSelector />
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  leftSection: {
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7fc',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
});
