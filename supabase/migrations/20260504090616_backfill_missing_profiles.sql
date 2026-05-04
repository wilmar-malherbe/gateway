/*
  # Backfill missing profile rows

  1. Changes
    - Inserts profile rows for any auth.users entries that do not yet have
      a corresponding row in the profiles table
    - Uses first_name and last_name from auth user metadata where available

  2. Important Notes
    - This is a one-time data backfill for users created before the
      on_auth_user_created trigger was installed
    - Does not affect users who already have profile rows
*/

INSERT INTO public.profiles (id, first_name, last_name)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'first_name', ''),
  COALESCE(u.raw_user_meta_data ->> 'last_name', '')
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
