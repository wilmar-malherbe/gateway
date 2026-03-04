import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { COLORS, Fonts, SPACING } from '@/constants/theme';

export function LanguageSelector() {
  const { language, toggleLanguage } = useLanguage();

  const getFlagEmoji = () => {
    return language === 'afr' ? '🇿🇦' : '🇬🇧';
  };

  const getLanguageText = () => {
    return language === 'afr' ? 'AFR' : 'ENG';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleLanguage}
      activeOpacity={0.7}
    >
      <Text style={styles.flag}>{getFlagEmoji()}</Text>
      <Text style={styles.languageText}>{getLanguageText()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#f0f7fc',
    borderRadius: 20,
    gap: SPACING.xs,
  },
  flag: {
    fontSize: 20,
  },
  languageText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: COLORS.primary,
  },
});
