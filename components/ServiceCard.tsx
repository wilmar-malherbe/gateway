import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, Fonts, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface ServiceCardProps {
  time: string;
  description: string;
  capacity: string;
  isUpcoming?: boolean;
}

export function ServiceCard({ time, description, capacity, isUpcoming = false }: ServiceCardProps) {
  return (
    <View style={[styles.card, isUpcoming && styles.upcomingCard]}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primary} />
          <Text style={styles.time}>{time}</Text>
        </View>
        {isUpcoming && <View style={styles.upcomingBadge} />}
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.capacityContainer}>
        <MaterialCommunityIcons name="account-multiple-outline" size={16} color={COLORS.lightText} />
        <Text style={styles.capacity}>Capacity: {capacity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#0d7ac4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  upcomingCard: {
    borderLeftColor: COLORS.success,
    backgroundColor: '#f0f7f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  time: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    marginBottom: SPACING.md,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  capacity: {
    fontSize: 12,
    fontFamily: Fonts.light,
    color: COLORS.lightText,
  },
  upcomingBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
  },
});
