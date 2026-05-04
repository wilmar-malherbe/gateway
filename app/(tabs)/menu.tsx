import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ChevronRight, Globe } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export default function MenuScreen() {
  const { profile } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const t = translate(language);
  const router = useRouter();

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || t.placeholders.userName;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.first_name?.[0] ?? '').toUpperCase()}{(profile?.last_name?.[0] ?? '').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.greetingText}>{t.welcome}, {displayName}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <User size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemText}>{t.profile.myAccount}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.lightText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Globe size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemText}>
                {language === 'afr' ? 'English' : 'Afrikaans'}
              </Text>
            </View>
            <ChevronRight size={20} color={COLORS.lightText} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  greetingSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: COLORS.white,
  },
  greetingText: {
    fontSize: 20,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.text,
  },
});
