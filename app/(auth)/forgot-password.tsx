import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { resetPassword } = useAuth();
  const { language } = useLanguage();
  const t = translate(language);
  const router = useRouter();

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleReset = async () => {
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await resetPassword(email.trim());
    setSubmitting(false);

    if (resetError) {
      setError(resetError);
    } else {
      setSuccess(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/Helderberg_Gemeente_Logo_Blou.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{t.auth.resetPassword}</Text>
        <Text style={styles.subtitle}>{t.auth.enterEmailToReset}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{t.auth.resetSuccess}</Text>
          </View>
        )}

        {!success && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.auth.email}</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t.auth.email}
                placeholderTextColor={COLORS.lightText}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!submitting}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>{t.auth.sendResetLink}</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.backLinkText}>{t.auth.backToLogin}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// NOTE: For password reset to work, you must configure the redirect URL in:
// Supabase Dashboard > Authentication > URL Configuration > Redirect URLs
// Add: project://reset-password

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxl,
    overflow: 'visible' as const,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 200,
    height: 70,
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  successText: {
    color: COLORS.success,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    overflow: 'visible' as const,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: Fonts.semibold,
    fontSize: 16,
    paddingRight: 4,
  },
  backLink: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    overflow: 'visible' as const,
  },
  backLinkText: {
    color: COLORS.primary,
    fontFamily: Fonts.semibold,
    fontSize: 14,
    paddingRight: 4,
  },
});
