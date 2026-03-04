/*
  # Create Inspirational Messages Table

  1. New Tables
    - `inspirational_messages`
      - `id` (uuid, primary key)
      - `message_afr` (text) - Inspirational message in Afrikaans
      - `message_eng` (text) - Inspirational message in English
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `inspirational_messages` table
    - Add policy for public read access to messages
  
  3. Sample Data
    - Insert 30 inspirational messages in both languages
*/

CREATE TABLE IF NOT EXISTS inspirational_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_afr text NOT NULL,
  message_eng text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inspirational_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read inspirational messages"
  ON inspirational_messages
  FOR SELECT
  TO public
  USING (true);

-- Insert sample inspirational messages
INSERT INTO inspirational_messages (message_afr, message_eng) VALUES
  ('God is jou toevlug en sterkte, ''n hulp in tye van nood.', 'God is your refuge and strength, a help in times of trouble.'),
  ('Vertrou op die Here met jou hele hart.', 'Trust in the Lord with all your heart.'),
  ('Wees sterk en moedig, want die Here is met jou.', 'Be strong and courageous, for the Lord is with you.'),
  ('Die Here is my herder, ek kom niks kort nie.', 'The Lord is my shepherd, I lack nothing.'),
  ('Vrees nie, want Ek is met jou.', 'Fear not, for I am with you.'),
  ('In alles dank die Here.', 'In everything give thanks to the Lord.'),
  ('Soek eers die Koninkryk van God.', 'Seek first the Kingdom of God.'),
  ('Gooi al jou besorgdheid op Hom.', 'Cast all your anxieties on Him.'),
  ('Die Here sal jou pad reggemaak.', 'The Lord will make your paths straight.'),
  ('Wees bly in die hoop, geduldig in die verdrukking.', 'Be joyful in hope, patient in affliction.'),
  ('God se genade is genoeg vir jou.', 'God''s grace is sufficient for you.'),
  ('Wandel in liefde soos Christus ons liefgehad het.', 'Walk in love as Christ loved us.'),
  ('Laat jou lig skyn voor die mense.', 'Let your light shine before others.'),
  ('Die vreugde van die Here is jou krag.', 'The joy of the Lord is your strength.'),
  ('Dien die Here met blydskap.', 'Serve the Lord with gladness.'),
  ('God is liefde, en wie in die liefde bly, bly in God.', 'God is love, and whoever abides in love abides in God.'),
  ('Al wat julle doen, doen dit vir die eer van God.', 'Whatever you do, do it all for the glory of God.'),
  ('Vrede laat Ek vir julle na.', 'Peace I leave with you.'),
  ('Ek kan alles doen deur Christus wat my krag gee.', 'I can do all things through Christ who strengthens me.'),
  ('Die Here seën jou en behoede jou.', 'The Lord bless you and keep you.'),
  ('Wees vars en volhard in die gebed.', 'Be alert and continue in prayer.'),
  ('God sal al julle behoeftes voorsien.', 'God will supply all your needs.'),
  ('Liefde is geduldig, liefde is vriendelik.', 'Love is patient, love is kind.'),
  ('Julle is die sout van die aarde.', 'You are the salt of the earth.'),
  ('Die Here is getrou en sal julle versterk.', 'The Lord is faithful and will strengthen you.'),
  ('Ons weet dat God alles ten goede laat meewerk.', 'We know that God works all things for good.'),
  ('Bly in My en Ek in julle.', 'Abide in Me and I in you.'),
  ('Soos die hart na waterstrome smag, so smag my siel na U.', 'As the deer pants for water, so my soul longs for You.'),
  ('God het ons nie ''n gees van vrees gegee nie.', 'God has not given us a spirit of fear.'),
  ('Groot is U getrouheid, Here.', 'Great is Your faithfulness, Lord.');