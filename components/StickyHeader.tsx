import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LanguageSelector } from './LanguageSelector';
import { COLORS, SPACING, SHADOWS } from '@/constants/theme';

export function StickyHeader() {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={require('@/assets/images/Helderberg_Gemeente_Logo_Blou.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightSection}>
        <LanguageSelector />
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  leftSection: {
    flex: 1,
  },
  logo: {
    width: 160,
    height: 48,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
