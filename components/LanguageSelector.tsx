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
      <Text style={styles.languageText}>{getLanguageText() + '\u00A0'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: '#f0f7fc',
    borderRadius: 16,
    gap: 4,
    minWidth: 65,
  },
  flag: {
    fontSize: 14,
  },
  languageText: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
});
