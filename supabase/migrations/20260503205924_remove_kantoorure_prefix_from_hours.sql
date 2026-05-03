/*
  # Remove "Kantoorure:" prefix from hours_of_operation

  ## Overview
  Removes the redundant "Kantoorure:" heading from the hours_of_operation field
  since the UI already displays this as the card title.
*/

UPDATE contact_info
SET hours_of_operation = 'Maandag: 08:30-15:00
Dinsdag: 09:00-15:00
Woensdag - Donderdag: 08:30-15:00
Vrydag: 08:30-13:00

Skoolvakansies:
Maandag - Vrydag: 08:30-13:00

Sondagontvangs: 08:30-11:30
(Gesluit tydens skoolvakansies en langnaweke)'
WHERE department = 'Front Office';