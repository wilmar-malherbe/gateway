import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();

    const subscription = supabase
      .channel('dash_calendar_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dash_calendar_events',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newEvent = payload.new as Event;
            if (newEvent.status === 'confirmed' && !payload.new.deleted_at) {
              setEvents((prev) => [...prev, newEvent].sort(sortEvents));
            }
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.deleted_at || payload.new.status === 'cancelled') {
              setEvents((prev) => prev.filter((event) => event.id !== payload.new.id));
            } else {
              setEvents((prev) =>
                prev.map((event) =>
                  event.id === payload.new.id ? (payload.new as Event) : event
                ).sort(sortEvents)
              );
            }
          } else if (payload.eventType === 'DELETE') {
            setEvents((prev) => prev.filter((event) => event.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getEventSortDate = (event: Event): string => {
    if (event.start_at) return event.start_at;
    if (event.start_date) return event.start_date;
    return '';
  };

  const sortEvents = (a: Event, b: Event) => {
    return getEventSortDate(a).localeCompare(getEventSortDate(b));
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('dash_calendar_events')
        .select('id, summary, description, location, start_at, end_at, start_date, end_date, is_all_day, status, event_type, created_at')
        .eq('status', 'confirmed')
        .is('deleted_at', null)
        .order('start_at', { ascending: true, nullsFirst: false });

      if (err) throw err;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEvents();
  };

  const getEventsForDate = (dateString: string) => {
    return events.filter((event) => {
      if (event.is_all_day && event.start_date && event.end_date) {
        return dateString >= event.start_date && dateString < event.end_date;
      }
      if (event.is_all_day && event.start_date) {
        return dateString === event.start_date;
      }
      if (event.start_at) {
        const eventDate = event.start_at.split('T')[0];
        return eventDate === dateString;
      }
      return false;
    });
  };

  return { events, loading, error, refetch, getEventsForDate };
}
