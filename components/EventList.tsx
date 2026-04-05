import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Event } from '@/types/event';
import { EventCard } from './EventCard';
import { COLORS, Fonts, SPACING } from '@/constants/theme';
import { Calendar } from 'lucide-react-native';

interface EventListProps {
  events: Event[];
  selectedDate: Date;
}

export function EventList({ events, selectedDate }: EventListProps) {
  const formatDateDisplay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateTitle}>
          {isToday(selectedDate) ? 'Today' : formatDateDisplay(selectedDate)}
        </Text>
        <Text style={styles.eventCount}>
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar size={48} color={COLORS.lightText} />
          <Text style={styles.emptyStateText}>No events scheduled</Text>
          <Text style={styles.emptyStateSubtext}>
            No events are scheduled for this date
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsListContent}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  dateTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  eventCount: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
  },
  eventsList: {
    flex: 1,
  },
  eventsListContent: {
    paddingBottom: SPACING.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: COLORS.lightText,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
