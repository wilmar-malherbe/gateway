import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Event } from '@/types/event';
import { COLORS, Fonts, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Clock, MapPin } from 'lucide-react-native';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeDisplay = () => {
    if (event.is_all_day) return 'All Day';
    if (event.start_at && event.end_at) {
      return `${formatTimestamp(event.start_at)} - ${formatTimestamp(event.end_at)}`;
    }
    if (event.start_at) return formatTimestamp(event.start_at);
    return null;
  };

  const timeDisplay = getTimeDisplay();

  return (
    <View style={styles.card}>
      <Text style={styles.eventName}>{event.summary}</Text>

      {timeDisplay && (
        <View style={styles.detailRow}>
          <Clock size={16} color={COLORS.lightText} />
          <Text style={styles.detailText}>{timeDisplay}</Text>
        </View>
      )}

      {event.location ? (
        <View style={styles.detailRow}>
          <MapPin size={16} color={COLORS.lightText} />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>
      ) : null}

      {event.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {event.description}
        </Text>
      ) : null}
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
