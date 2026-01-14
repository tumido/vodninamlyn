-- Seed file for creating admin user
-- This creates a user in the auth.users table for admin access

-- Insert admin user into auth.users
-- Password: test
-- Email: from NEXT_PUBLIC_ADMIN_USER environment variable (default: vodni-na-mlyn@vodni-na-mlyn.cz)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@admin.com', -- This will be the admin email
  -- Password is 'test' - hashed with bcrypt
  -- Generated using: SELECT crypt('test', gen_salt('bf'))
  crypt('test', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Confirm the user's email (mark as verified)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@admin.com';

-- Add comment explaining the seed file
COMMENT ON EXTENSION pgcrypto IS 'Seed file creates admin user with email from NEXT_PUBLIC_ADMIN_USER env var and password "test"';

-- ========================================
-- RSVP Test Data
-- ========================================

-- 1. Entry that is NOT attending
SELECT public.submit_rsvp(
  names := ARRAY['Jana Nováková'],
  attending := 'no',
  message := 'Bohužel se nemůžeme zúčastnit. Přejeme vám krásný den!'
);

-- 2. Entry that IS attending but doesn't want to stay (no accommodation)
SELECT public.submit_rsvp(
  names := ARRAY['Petr Svoboda'],
  attending := 'yes',
  accommodation := 'no-sleep',
  "drinkChoice" := 'vino',
  message := 'Těším se, ale budu muset odjet ještě večer.'
);

-- 3. Entry with multiple secondary attendees, wants accommodation and beer
SELECT public.submit_rsvp(
  names := ARRAY['Martin Dvořák', 'Lenka Dvořáková', 'Tomáš Dvořák'],
  attending := 'yes',
  accommodation := 'roof',
  "drinkChoice" := 'pivo',
  "dietaryRestrictions" := 'Lenka je vegetariánka',
  message := 'Celá rodina se těší! Děkujeme za možnost přespání.'
);

-- 4. Entry with multiple secondary attendees and custom drink
SELECT public.submit_rsvp(
  names := ARRAY['Eva Procházková', 'Jakub Procházka', 'Marek Novotný'],
  attending := 'yes',
  accommodation := 'own-tent',
  "drinkChoice" := 'other',
  "customDrink" := 'Prosecco',
  "dietaryRestrictions" := 'Marek má alergii na ořechy',
  message := 'Přivezeme si vlastní stan. Moc se těšíme!'
);
