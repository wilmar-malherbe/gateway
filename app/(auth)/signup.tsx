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

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signUp } = useAuth();
  const { language } = useLanguage();
  const t = translate(language);
  const router = useRouter();

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignUp = async () => {
    setError(null);

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      setError('Please enter your last name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signUp(email.trim(), password, firstName.trim(), lastName.trim());
    setSubmitting(false);

    if (authError) {
      setError(authError);
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

        <Text style={styles.title}>{t.auth.createYourAccount}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.nameRow}>
          <View style={[styles.inputGroup, styles.nameInput]}>
            <Text style={styles.label}>{t.auth.firstName}</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t.auth.firstName}
              placeholderTextColor={COLORS.lightText}
              autoCapitalize="words"
              editable={!submitting}
            />
          </View>
          <View style={[styles.inputGroup, styles.nameInput]}>
            <Text style={styles.label}>{t.auth.lastName}</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t.auth.lastName}
              placeholderTextColor={COLORS.lightText}
              autoCapitalize="words"
              editable={!submitting}
            />
          </View>
        </View>

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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.auth.password}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t.auth.password}
            placeholderTextColor={COLORS.lightText}
            secureTextEntry
            editable={!submitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.auth.confirmPassword}</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t.auth.confirmPassword}
            placeholderTextColor={COLORS.lightText}
            secureTextEntry
            editable={!submitting}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>{t.auth.signUp}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{t.auth.haveAccount} </Text>
          <TouchableOpacity onPress={() => router.back()} disabled={submitting}>
            <Text style={styles.footerLink}>{t.auth.signIn}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
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
    marginBottom: SPACING.xl,
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
  nameRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  nameInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.lightText,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.primary,
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },
});
