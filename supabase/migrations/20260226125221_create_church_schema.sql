/*
  # Create Church Data Schema

  1. New Tables
    - `services` - Sunday service times and details
      - `id` (uuid, primary key)
      - `day_of_week` (text) - Day of week (e.g., "Sunday")
      - `service_time` (text) - Service time (e.g., "8:00 AM")
      - `description` (text) - Service description
      - `capacity` (integer) - Room capacity
      - `created_at` (timestamp)
    
    - `announcements` - Church announcements
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `priority` (integer) - Display priority
      - `image_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `livestream` - Current livestream status
      - `id` (uuid, primary key)
      - `is_active` (boolean)
      - `youtube_url` (text)
      - `title` (text)
      - `start_time` (timestamp)
      - `updated_at` (timestamp)
    
    - `contact_info` - Office contact information
      - `id` (uuid, primary key)
      - `department` (text)
      - `phone_number` (text)
      - `email` (text)
      - `hours_of_operation` (text)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for all tables
    - All data is public/read-only for app users
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  service_time text NOT NULL,
  description text NOT NULL,
  capacity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS livestream (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT false,
  youtube_url text,
  title text,
  start_time timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department text NOT NULL,
  phone_number text NOT NULL,
  email text,
  hours_of_operation text
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestream ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read announcements"
  ON announcements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read livestream"
  ON livestream FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read contact info"
  ON contact_info FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO services (day_of_week, service_time, description, capacity) VALUES
  ('Sunday', '8:00 AM', 'Traditional Service', 200),
  ('Sunday', '11:00 AM', 'Contemporary Service', 300),
  ('Sunday', '6:00 PM', 'Teen Service', 150);

INSERT INTO contact_info (department, phone_number, email, hours_of_operation) VALUES
  ('Front Office', '(555) 123-4567', 'office@gracechurch.com', 'Monday - Friday: 9:00 AM - 5:00 PM');
