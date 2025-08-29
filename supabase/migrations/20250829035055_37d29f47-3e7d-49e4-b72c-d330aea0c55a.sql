-- Create admin user account and update existing user password
INSERT INTO auth.users (
  id,
  instance_id,
  email, 
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'adminFG@gmail.com',
  crypt('Password@01', gen_salt('bf')),
  now(),
  now(), 
  now(),
  'authenticated',
  'authenticated',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Insert admin profile with admin role
INSERT INTO public.profiles (
  user_id,
  email,
  display_name,
  role
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'adminFG@gmail.com'),
  'adminFG@gmail.com', 
  'Admin FG',
  'admin'::app_role
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin'::app_role,
  display_name = 'Admin FG';

-- Update existing user password
UPDATE auth.users 
SET encrypted_password = crypt('Password@01', gen_salt('bf')),
    updated_at = now()
WHERE email = 'dugarvishal@gmail.com';