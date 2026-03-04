import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInspirationMessage } from '@/hooks/useInspirationMessage';
import { translate } from '@/translations';
import { COLORS, Fonts, SPACING } from '@/constants/theme';

export function WelcomeSection() {
  const { language } = useLanguage();
  const { message, loading } = useInspirationMessage(language);
  const t = translate(language);

  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {t.welcome} {t.placeholders.userName}
      </Text>
      {!loading && displayMessage && (
        <Animated.View entering={FadeIn.duration(600)}>
          <Text style={styles.inspirationText}>{displayMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: 26,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  inspirationText: {
    fontSize: 14,
    fontFamily: Fonts.light,
    color: COLORS.lightText,
    fontWeight: '300',
    lineHeight: 20,
  },
});
