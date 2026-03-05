/*
  # Create Seasonal Service Times Schema

  ## Overview
  This migration creates the database structure for managing church service times
  with seasonal support (Summer/Winter). It enables easy management of service
  schedules that change between seasons.

  ## New Tables

  ### `service_times`
  Stores individual service information with seasonal variants:
  - `id` (uuid, primary key) - Unique identifier for each service
  - `service_name_afr` (text) - Service name in Afrikaans
  - `service_name_eng` (text) - Service name in English
  - `service_time` (text) - Time of service (e.g., "09:00", "18:00")
  - `venue` (text) - Location/venue at the church
  - `season` (text) - Either "summer" or "winter"
  - `display_order` (integer) - Order for displaying services in carousel
  - `is_active` (boolean) - Whether the service is currently active
  - `created_at` (timestamptz) - Record creation timestamp

  ### `season_config`
  Controls which season is currently active:
  - `id` (uuid, primary key) - Unique identifier
  - `is_summer` (boolean) - True for summer, false for winter
  - `updated_at` (timestamptz) - Last update timestamp
  - `description` (text) - Optional notes about the season

  ## Security
  - Enable RLS on both tables
  - Public read access (all users can view service times)
  - No write access through client (admin only via database)

  ## Sample Data
  - Inserts initial season configuration (currently Summer)
  - Adds 11 sample services for both Summer and Winter seasons
*/

-- Create service_times table
CREATE TABLE IF NOT EXISTS service_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name_afr text NOT NULL,
  service_name_eng text NOT NULL,
  service_time text NOT NULL,
  venue text NOT NULL,
  season text NOT NULL CHECK (season IN ('summer', 'winter')),
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create season_config table
CREATE TABLE IF NOT EXISTS season_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_summer boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  description text
);

-- Enable RLS
ALTER TABLE service_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_config ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view service times"
  ON service_times FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view season config"
  ON season_config FOR SELECT
  TO public
  USING (true);

-- Insert initial season configuration (Summer)
INSERT INTO season_config (is_summer, description)
VALUES (true, 'Current season configuration')
ON CONFLICT DO NOTHING;

-- Insert Summer service times (11 services)
INSERT INTO service_times (service_name_afr, service_name_eng, service_time, venue, season, display_order) VALUES
  ('Vroeë Oggend Erediens', 'Early Morning Service', '07:00', 'Hoofkerk', 'summer', 1),
  ('Oggend Erediens', 'Morning Service', '09:00', 'Hoofkerk', 'summer', 2),
  ('Engelse Erediens', 'English Service', '09:00', 'Kapel', 'summer', 3),
  ('Kinderkerk', 'Children''s Church', '09:00', 'Saal A', 'summer', 4),
  ('Middagerediens', 'Midday Service', '11:00', 'Hoofkerk', 'summer', 5),
  ('Jeugdiens', 'Youth Service', '17:00', 'Jeug Sentrum', 'summer', 6),
  ('Aand Erediens', 'Evening Service', '18:00', 'Hoofkerk', 'summer', 7),
  ('Studentediens', 'Student Service', '19:00', 'Kapel', 'summer', 8),
  ('Gebedsbyeenkoms', 'Prayer Meeting', '18:30', 'Gebedsaal', 'summer', 9),
  ('Vrydag Jongmense', 'Friday Youth', '19:00', 'Jeug Sentrum', 'summer', 10),
  ('Saterdag Bediening', 'Saturday Ministry', '10:00', 'Saal B', 'summer', 11);

-- Insert Winter service times (11 services with adjusted times)
INSERT INTO service_times (service_name_afr, service_name_eng, service_time, venue, season, display_order) VALUES
  ('Vroeë Oggend Erediens', 'Early Morning Service', '07:30', 'Hoofkerk', 'winter', 1),
  ('Oggend Erediens', 'Morning Service', '09:30', 'Hoofkerk', 'winter', 2),
  ('Engelse Erediens', 'English Service', '09:30', 'Kapel', 'winter', 3),
  ('Kinderkerk', 'Children''s Church', '09:30', 'Saal A', 'winter', 4),
  ('Middagerediens', 'Midday Service', '11:30', 'Hoofkerk', 'winter', 5),
  ('Jeugdiens', 'Youth Service', '16:30', 'Jeug Sentrum', 'winter', 6),
  ('Aand Erediens', 'Evening Service', '18:00', 'Hoofkerk', 'winter', 7),
  ('Studentediens', 'Student Service', '18:30', 'Kapel', 'winter', 8),
  ('Gebedsbyeenkoms', 'Prayer Meeting', '18:00', 'Gebedsaal', 'winter', 9),
  ('Vrydag Jongmense', 'Friday Youth', '18:30', 'Jeug Sentrum', 'winter', 10),
  ('Saterdag Bediening', 'Saturday Ministry', '10:30', 'Saal B', 'winter', 11);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_times_season ON service_times(season);
CREATE INDEX IF NOT EXISTS idx_service_times_display_order ON service_times(display_order);