import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/event';

export function useEvents(dateFilter?: { startDate?: string; endDate?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();

    // Set up real-time subscription
    const subscription = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents((prev) => [...prev, payload.new as Event].sort(sortByDateTime));
          } else if (payload.eventType === 'UPDATE') {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === payload.new.id ? (payload.new as Event) : event
              ).sort(sortByDateTime)
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents((prev) => prev.filter((event) => event.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [dateFilter?.startDate, dateFilter?.endDate]);

  const sortByDateTime = (a: Event, b: Event) => {
    const dateComparison = a.event_date.localeCompare(b.event_date);
    if (dateComparison !== 0) return dateComparison;
    return a.start_time.localeCompare(b.start_time);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (dateFilter?.startDate) {
        query = query.gte('event_date', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('event_date', dateFilter.endDate);
      }

      const { data, error: err } = await query;

      if (err) throw err;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEvents();
  };

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.event_date === date);
  };

  return { events, loading, error, refetch, getEventsForDate };
}
