/*
  # Create user preferences table

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key) - Unique identifier for each preference record
      - `session_id` (text, unique) - Temporary session identifier for users without authentication
      - `language` (text) - Language preference ('afr' or 'eng')
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `user_preferences` table
    - Add policy for public read access (anyone can read preferences)
    - Add policy for public insert/update access (anyone can manage their session preferences)
    - This is designed for temporary session-based preferences
    - Table structure allows easy migration to user_id when authentication is added
  
  3. Performance
    - Add unique index on session_id for fast lookups
    - Add index on updated_at for potential cleanup queries
  
  4. Notes
    - Preferences are session-based and don't persist across reinstalls (as per requirements)
    - When authentication is added, a user_id column can be added and policies updated
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  language text NOT NULL DEFAULT 'afr',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read preferences (needed for language selection)
CREATE POLICY "Anyone can read preferences"
  ON user_preferences
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert their own preferences
CREATE POLICY "Anyone can insert preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update preferences
CREATE POLICY "Anyone can update preferences"
  ON user_preferences
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_updated_at ON user_preferences(updated_at);

-- Add constraint to ensure language is valid
ALTER TABLE user_preferences 
ADD CONSTRAINT valid_language CHECK (language IN ('afr', 'eng'));