/*
  # Enable RLS on dash_calendar_events

  1. Security Changes
    - Enable Row Level Security on `dash_calendar_events` table
    - Add a SELECT policy allowing anonymous and authenticated users to read confirmed, non-deleted events
    - No INSERT/UPDATE/DELETE policies (data is managed externally via sync)
*/

ALTER TABLE dash_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read confirmed events"
  ON dash_calendar_events
  FOR SELECT
  TO anon, authenticated
  USING (status = 'confirmed' AND deleted_at IS NULL);
