-- Create adminFG@gmail.com user and set admin role
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'adminFG@gmail.com',
  crypt('Password@01', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "Admin User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Update dugarvishal@gmail.com password and set admin role
UPDATE auth.users 
SET encrypted_password = crypt('Password@01', gen_salt('bf'))
WHERE email = 'dugarvishal@gmail.com';

-- Ensure both users have admin profiles
INSERT INTO public.profiles (user_id, email, display_name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data ->> 'display_name', 'Admin User'),
  'admin'::app_role
FROM auth.users 
WHERE email IN ('adminFG@gmail.com', 'dugarvishal@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::app_role;