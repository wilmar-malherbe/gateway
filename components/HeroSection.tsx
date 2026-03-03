import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const handleProfilePress = () => {
    // Placeholder for future profile/account functionality
    console.log('Profile pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress} activeOpacity={0.7}>
        <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/headerImage copy.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderBottomWidth: 7,
    borderColor: COLORS.primary,
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7fc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.light,
    color: COLORS.lightText,
    textAlign: 'center',
    fontWeight: '300',
  },
});
