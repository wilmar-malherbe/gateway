import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Event } from '@/types/event';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Clock, MapPin, User } from 'lucide-react-native';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'service':
        return COLORS.primary;
      case 'meeting':
        return COLORS.secondary;
      case 'special':
        return COLORS.warning;
      default:
        return COLORS.success;
    }
  };

  return (
    <View style={styles.card}>
      {event.category && (
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(event.category) },
          ]}
        >
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      )}

      <Text style={styles.eventName}>{event.event_name}</Text>

      <View style={styles.detailRow}>
        <Clock size={16} color={COLORS.lightText} />
        <Text style={styles.detailText}>
          {formatTime(event.start_time)} - {formatTime(event.end_time)}
        </Text>
      </View>

      {event.location && (
        <View style={styles.detailRow}>
          <MapPin size={16} color={COLORS.lightText} />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>
      )}

      {event.organizer && (
        <View style={styles.detailRow}>
          <User size={16} color={COLORS.lightText} />
          <Text style={styles.detailText}>{event.organizer}</Text>
        </View>
      )}

      {event.description && (
        <Text style={styles.description} numberOfLines={3}>
          {event.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: Fonts.semibold,
    textTransform: 'capitalize',
  },
  eventName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.text,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
});
