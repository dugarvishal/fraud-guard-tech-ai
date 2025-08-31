-- Update dugarvishal@gmail.com password 
UPDATE auth.users 
SET encrypted_password = crypt('Password@01', gen_salt('bf'))
WHERE email = 'dugarvishal@gmail.com';

-- Update dugarvishal@gmail.com to admin role
UPDATE public.profiles 
SET role = 'admin'::app_role 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'dugarvishal@gmail.com');