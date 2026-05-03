export interface Event {
  id: number;
  summary: string;
  description: string | null;
  location: string | null;
  start_at: string | null;
  end_at: string | null;
  start_date: string | null;
  end_date: string | null;
  is_all_day: boolean;
  status: string;
  event_type: string | null;
  created_at: string;
}
