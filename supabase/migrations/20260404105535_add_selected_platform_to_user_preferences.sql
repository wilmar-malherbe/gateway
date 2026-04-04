/*
  # Add selected_platform to user_preferences table

  1. Changes
    - Add `selected_platform` column to `user_preferences` table
      - `selected_platform` (text, nullable) - Stores the ID of the selected video platform
  
  2. Purpose
    - Store user's preferred video platform selection alongside language preference
    - Uses the same session-based approach as language preference
    - Nullable to allow existing records to continue working without migration
  
  3. Notes
    - No RLS changes needed - existing policies cover the new column
    - Platform ID will be stored as text (e.g., 'youtube', 'facebook', etc.)
    - Default is null, allowing app to select first available platform
*/

-- Add selected_platform column to user_preferences table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'selected_platform'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN selected_platform text;
  END IF;
END $$;