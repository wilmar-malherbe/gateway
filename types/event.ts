export interface Event {
  id: string;
  event_name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  organizer: string | null;
  location: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}
