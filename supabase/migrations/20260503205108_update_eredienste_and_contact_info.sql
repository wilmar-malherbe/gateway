/*
  # Update Eredienste (Service Times) and Contact Information

  ## Overview
  Replaces all existing service times with the updated church service schedule
  and updates the office hours information.

  ## Changes

  ### Service Times (service_times table)
  - Removes all existing service entries
  - Inserts 10 new services for both summer and winter seasons:
    1. 08:00 Klassieke Diens - die Kerk
    2. 08:00 Meditatiewe Diens - die Kapel
    3. 09:00 Hoop Geloofsgemeenskap - Curro Sitari Skoolsaal
    4. 09:30 Informele Diens - die Kerk
    5. 09:30 Meditatiewe Diens - die Kapel
    6. 09:30 Kiddiekerk - Joppe
    7. 09:30 Tekkiekerk - Talanja Jeugsentrum
    8. 09:30 Helderberg Village - Helderberg Village
    9. 18:00 Tieners - die Kerk/Groepies
    10. 19:00 Aandkerk - die Kapel

  ### Contact Info (contact_info table)
  - Updates office hours with detailed schedule including:
    - Weekday hours
    - School holiday hours
    - Sunday reception hours

  ## Security
  - No changes to RLS policies (existing public read policies remain)
*/

-- Remove all existing service times
DELETE FROM service_times;

-- Insert new summer service times
INSERT INTO service_times (service_name_afr, service_name_eng, service_time, venue, season, display_order) VALUES
  ('Klassieke Diens', 'Classical Service', '08:00', 'die Kerk', 'summer', 1),
  ('Meditatiewe Diens', 'Meditative Service', '08:00', 'die Kapel', 'summer', 2),
  ('Hoop Geloofsgemeenskap', 'Hope Faith Community', '09:00', 'Curro Sitari Skoolsaal', 'summer', 3),
  ('Informele Diens', 'Informal Service', '09:30', 'die Kerk', 'summer', 4),
  ('Meditatiewe Diens', 'Meditative Service', '09:30', 'die Kapel', 'summer', 5),
  ('Kiddiekerk', 'Kids Church', '09:30', 'Joppe', 'summer', 6),
  ('Tekkiekerk', 'Tech Church', '09:30', 'Talanja Jeugsentrum', 'summer', 7),
  ('Helderberg Village', 'Helderberg Village', '09:30', 'Helderberg Village', 'summer', 8),
  ('Tieners', 'Teens', '18:00', 'die Kerk/Groepies', 'summer', 9),
  ('Aandkerk', 'Evening Church', '19:00', 'die Kapel', 'summer', 10);

-- Insert same services for winter season
INSERT INTO service_times (service_name_afr, service_name_eng, service_time, venue, season, display_order) VALUES
  ('Klassieke Diens', 'Classical Service', '08:00', 'die Kerk', 'winter', 1),
  ('Meditatiewe Diens', 'Meditative Service', '08:00', 'die Kapel', 'winter', 2),
  ('Hoop Geloofsgemeenskap', 'Hope Faith Community', '09:00', 'Curro Sitari Skoolsaal', 'winter', 3),
  ('Informele Diens', 'Informal Service', '09:30', 'die Kerk', 'winter', 4),
  ('Meditatiewe Diens', 'Meditative Service', '09:30', 'die Kapel', 'winter', 5),
  ('Kiddiekerk', 'Kids Church', '09:30', 'Joppe', 'winter', 6),
  ('Tekkiekerk', 'Tech Church', '09:30', 'Talanja Jeugsentrum', 'winter', 7),
  ('Helderberg Village', 'Helderberg Village', '09:30', 'Helderberg Village', 'winter', 8),
  ('Tieners', 'Teens', '18:00', 'die Kerk/Groepies', 'winter', 9),
  ('Aandkerk', 'Evening Church', '19:00', 'die Kapel', 'winter', 10);

-- Update contact info with new office hours
UPDATE contact_info
SET hours_of_operation = 'Kantoorure:
Maandag: 08:30-15:00
Dinsdag: 09:00-15:00
Woensdag - Donderdag: 08:30-15:00
Vrydag: 08:30-13:00

Skoolvakansies:
Maandag - Vrydag: 08:30-13:00

Sondagontvangs: 08:30-11:30
(Gesluit tydens skoolvakansies en langnaweke)'
WHERE department = 'Front Office';