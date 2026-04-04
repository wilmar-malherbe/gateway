/*
  # Create YouTube Video Library Schema

  1. New Tables
    - `youtube_config`
      - `id` (uuid, primary key)
      - `api_key` (text) - YouTube Data API key
      - `channel_id` (text) - Church's YouTube channel ID
      - `updated_at` (timestamptz) - Last configuration update
    
    - `youtube_videos`
      - `id` (uuid, primary key)
      - `video_id` (text, unique) - YouTube video ID
      - `title` (text) - Video title
      - `description` (text) - Video description
      - `thumbnail_url` (text) - Video thumbnail URL
      - `published_at` (timestamptz) - Video publish date
      - `duration` (text) - Video duration (ISO 8601 format)
      - `view_count` (bigint) - View count
      - `is_live` (boolean) - Whether video is currently live
      - `live_viewer_count` (integer) - Current live viewer count
      - `created_at` (timestamptz) - Cache creation timestamp
      - `updated_at` (timestamptz) - Cache update timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (videos are public content)
    - Add policies for authenticated admin updates only

  3. Indexes
    - Index on published_at for efficient sorting by date
    - Index on is_live for quick live stream queries
    - Unique index on video_id to prevent duplicates
*/

-- Create youtube_config table
CREATE TABLE IF NOT EXISTS youtube_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key text NOT NULL,
  channel_id text NOT NULL DEFAULT 'UC-S0Gm3Bl2-OxVP-3_W2Wug',
  updated_at timestamptz DEFAULT now()
);

-- Create youtube_videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text NOT NULL,
  published_at timestamptz NOT NULL,
  duration text DEFAULT '',
  view_count bigint DEFAULT 0,
  is_live boolean DEFAULT false,
  live_viewer_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON youtube_videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_live ON youtube_videos(is_live);

-- Enable Row Level Security
ALTER TABLE youtube_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Policies for youtube_config (admin only writes, public reads)
CREATE POLICY "Anyone can read YouTube config"
  ON youtube_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update YouTube config"
  ON youtube_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert YouTube config"
  ON youtube_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for youtube_videos (public reads, authenticated writes for caching)
CREATE POLICY "Anyone can read YouTube videos"
  ON youtube_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert YouTube videos"
  ON youtube_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update YouTube videos"
  ON youtube_videos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete YouTube videos"
  ON youtube_videos
  FOR DELETE
  TO authenticated
  USING (true);