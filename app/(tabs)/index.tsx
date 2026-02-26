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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import { CHURCH_INFO } from '@/constants/church';
import { HeroSection } from '@/components/HeroSection';
import { SectionHeader } from '@/components/SectionHeader';
import { ServiceCard } from '@/components/ServiceCard';
import { ActionButton } from '@/components/ActionButton';
import { InfoCard } from '@/components/InfoCard';
import { LivestreamBanner } from '@/components/LivestreamBanner';
import { useServices } from '@/hooks/useServices';
import { useLivestream } from '@/hooks/useLivestream';
import { useContactInfo } from '@/hooks/useContactInfo';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection
          title={CHURCH_INFO.name}
          subtitle="Welcome to our community of faith"
        />

        <View style={styles.contentPadding}>
          <LivestreamBanner
            isActive={livestream?.is_active || false}
            youtubeUrl={livestream?.youtube_url ?? undefined}
            title={livestream?.title ?? undefined}
          />

          <SectionHeader
            title="Sunday Services"
            subtitle="Join us this week"
          />

          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              time={service.service_time}
              description={service.description}
              capacity={service.capacity.toString()}
              isUpcoming={index === 1}
            />
          ))}

          <View style={styles.spacer} />

          <SectionHeader
            title="Connect With Us"
            subtitle="Stay updated and give"
          />

          <View style={styles.actionButtonsContainer}>
            <ActionButton
              label="Donate"
              icon="heart"
              onPress={handleDonate}
              fullWidth
            />
            <ActionButton
              label="Contact"
              icon="phone"
              onPress={handleCall}
              variant="secondary"
              fullWidth
            />
          </View>

          <View style={styles.spacer} />

          {contactInfo && (
            <>
              <SectionHeader title="Office Information" />

              <InfoCard
                icon="phone"
                title="Call Us"
                content={contactInfo.phone_number}
                isClickable
                onPress={handleCall}
              />

              {contactInfo.email && (
                <InfoCard
                  icon="email"
                  title="Email"
                  content={contactInfo.email}
                  isClickable
                  onPress={handleEmail}
                />
              )}

              {contactInfo.hours_of_operation && (
                <InfoCard
                  icon="clock-outline"
                  title="Office Hours"
                  content={contactInfo.hours_of_operation}
                />
              )}

              <InfoCard
                icon="map-marker"
                title="Address"
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
