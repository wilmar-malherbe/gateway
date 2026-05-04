import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { CHURCH_INFO } from '@/constants/church';
import { WelcomeSection } from '@/components/WelcomeSection';
import { SectionHeader } from '@/components/SectionHeader';
import { ActionButton } from '@/components/ActionButton';
import { InfoCard } from '@/components/InfoCard';
import { LivestreamBanner } from '@/components/LivestreamBanner';
import { SeasonHeader } from '@/components/SeasonHeader';
import { ServiceCarousel } from '@/components/ServiceCarousel';
import { AppLoadingOverlay } from '@/components/AppLoadingOverlay';
import { useLivestream } from '@/hooks/useLivestream';
import { useContactInfo } from '@/hooks/useContactInfo';
import { useSeasonalServices } from '@/hooks/useSeasonalServices';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const { language } = useLanguage();
  const t = translate(language);

  const { services, seasonConfig, loading: servicesLoading, refetch: refetchServices } = useSeasonalServices();
  const { livestream, loading: livestreamLoading, refetch: refetchLivestream } = useLivestream();
  const { contactInfo, loading: contactLoading, refetch: refetchContactInfo } = useContactInfo();

  const isInitialLoading = servicesLoading || livestreamLoading || contactLoading;

  const handleOverlayFinished = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchServices(), refetchLivestream(), refetchContactInfo()]);
    setRefreshing(false);
  };

  const handleDonate = () => {
    Linking.openURL(CHURCH_INFO.donationLink).catch(() => {
      Alert.alert('Error', 'Unable to open donation link');
    });
  };

  const handleCall = () => {
    if (contactInfo?.phone_number) {
      Linking.openURL(`tel:${contactInfo.phone_number}`).catch(() => {
        Alert.alert('Error', 'Unable to make call');
      });
    }
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:+27839882003').catch(() => {
      Alert.alert('Error', 'Unable to make call');
    });
  };

  const handleEmail = () => {
    if (contactInfo?.email) {
      Linking.openURL(`mailto:${contactInfo.email}`).catch(() => {
        Alert.alert('Error', 'Unable to open email');
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {overlayVisible && (
        <AppLoadingOverlay isLoading={isInitialLoading} onFinished={handleOverlayFinished} />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        <WelcomeSection />

        <View style={styles.contentPadding}>
          <LivestreamBanner
            isActive={livestream?.is_active || false}
            youtubeUrl={livestream?.youtube_url ?? undefined}
            title={livestream?.title ?? undefined}
          />

          <View style={styles.seasonalServicesSection}>
            <SeasonHeader isSummer={seasonConfig?.is_summer ?? true} />
            <ServiceCarousel services={services} />
          </View>

          <View style={styles.spacer} />

          <SectionHeader
            title={t.home.connectWithUs}
            subtitle={t.home.connectWithUsSubtitle}
          />

          <View style={styles.actionButtonsContainer}>
            <ActionButton
              label={t.home.donate}
              icon="heart"
              onPress={handleDonate}
              fullWidth
            />
            <ActionButton
              label={t.home.contact}
              icon="phone"
              onPress={handleCall}
              variant="secondary"
              fullWidth
            />
          </View>

          <View style={styles.spacer} />

          {contactInfo && (
            <>
              <SectionHeader title={t.home.officeInformation} />

              <InfoCard
                icon="phone"
                title={t.contact.officeNumber}
                content={contactInfo.phone_number}
                isClickable
                onPress={handleCall}
              />

              <InfoCard
                icon="phone-alert"
                title={t.contact.emergencyNumber}
                content="+27 (83) 988 2003"
                isClickable
                onPress={handleEmergencyCall}
              />

              {contactInfo.email && (
                <InfoCard
                  icon="email"
                  title={t.contact.email}
                  content={contactInfo.email}
                  isClickable
                  onPress={handleEmail}
                />
              )}

              {contactInfo.hours_of_operation && (
                <InfoCard
                  icon="clock-outline"
                  title={t.contact.officeHours}
                  content={contactInfo.hours_of_operation}
                />
              )}

              <InfoCard
                icon="map-marker"
                title={t.contact.address}
                content={CHURCH_INFO.address}
              />
            </>
          )}

          <View style={styles.bottomPadding} />
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
    flexGrow: 1,
  },
  contentPadding: {
    paddingHorizontal: SPACING.lg,
  },
  spacer: {
    height: SPACING.xxl,
  },
  seasonalServicesSection: {
    marginBottom: SPACING.lg,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
