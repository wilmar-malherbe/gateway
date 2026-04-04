/*
  # Create Video Platforms Schema

  1. New Tables
    - `video_platforms`
      - `id` (uuid, primary key)
      - `platform_name` (text) - Display name like "YouTube", "Vimeo"
      - `platform_key` (text, unique) - Internal key like "youtube", "vimeo"
      - `is_active` (boolean) - Whether platform is enabled
      - `display_order` (integer) - Sort order for display
      - `icon_name` (text) - Lucide icon name for the platform
      - `created_at` (timestamptz)
    
    - `platform_config`
      - `id` (uuid, primary key)
      - `platform_id` (uuid, foreign key to video_platforms)
      - `config_key` (text) - Configuration key like "api_key", "channel_id"
      - `config_value` (text) - Configuration value
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (platforms are not sensitive)

  3. Initial Data
    - Insert YouTube as the first platform
    - Migrate existing youtube_config data to platform_config
*/

CREATE TABLE IF NOT EXISTS video_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name text NOT NULL,
  platform_key text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  icon_name text DEFAULT 'video',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platform_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid REFERENCES video_platforms(id) ON DELETE CASCADE,
  config_key text NOT NULL,
  config_value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(platform_id, config_key)
);

ALTER TABLE video_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video platforms"
  ON video_platforms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view platform config"
  ON platform_config FOR SELECT
  TO public
  USING (true);

INSERT INTO video_platforms (platform_name, platform_key, is_active, display_order, icon_name)
VALUES ('YouTube', 'youtube', true, 1, 'youtube')
ON CONFLICT (platform_key) DO NOTHING;

DO $$
DECLARE
  youtube_platform_id uuid;
  existing_api_key text;
  existing_channel_id text;
BEGIN
  SELECT id INTO youtube_platform_id FROM video_platforms WHERE platform_key = 'youtube';
  
  SELECT api_key, channel_id INTO existing_api_key, existing_channel_id 
  FROM youtube_config 
  LIMIT 1;
  
  IF existing_api_key IS NOT NULL THEN
    INSERT INTO platform_config (platform_id, config_key, config_value)
    VALUES (youtube_platform_id, 'api_key', existing_api_key)
    ON CONFLICT (platform_id, config_key) DO NOTHING;
  END IF;
  
  IF existing_channel_id IS NOT NULL THEN
    INSERT INTO platform_config (platform_id, config_key, config_value)
    VALUES (youtube_platform_id, 'channel_id', existing_channel_id)
    ON CONFLICT (platform_id, config_key) DO NOTHING;
  END IF;
END $$;
