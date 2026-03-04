import React, { useState } from 'react';
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
import { ServiceCard } from '@/components/ServiceCard';
import { ActionButton } from '@/components/ActionButton';
import { InfoCard } from '@/components/InfoCard';
import { LivestreamBanner } from '@/components/LivestreamBanner';
import { useServices } from '@/hooks/useServices';
import { useLivestream } from '@/hooks/useLivestream';
import { useContactInfo } from '@/hooks/useContactInfo';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { language } = useLanguage();
  const t = translate(language);

  const { services, refetch: refetchServices } = useServices();
  const { livestream, refetch: refetchLivestream } = useLivestream();
  const { contactInfo, refetch: refetchContactInfo } = useContactInfo();

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

  const handleEmail = () => {
    if (contactInfo?.email) {
      Linking.openURL(`mailto:${contactInfo.email}`).catch(() => {
        Alert.alert('Error', 'Unable to open email');
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

          <SectionHeader
            title={t.home.sundayServices}
            subtitle={t.home.sundayServicesSubtitle}
          />

          {services.length > 0 ? (
            services.map((service, index) => (
              <ServiceCard
                key={service.id}
                time={service.service_time}
                description={service.description}
                capacity={service.capacity.toString()}
                isUpcoming={index === 1}
              />
            ))
          ) : (
            <ServiceCard
              time="8:00 AM"
              description="Traditional Service"
              capacity="200"
              isUpcoming={false}
            />
          )}

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
                title={t.contact.callUs}
                content={contactInfo.phone_number}
                isClickable
                onPress={handleCall}
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
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
