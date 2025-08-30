-- Create admin user adminFG@gmail.com with admin role
-- Note: Users must be created through auth.users table, but we'll ensure the profile is ready

-- First, ensure we have the profile ready for the admin user
-- We'll use the user_id from when the admin signs up through the auth system

-- For now, let's create a function to assign admin role when adminFG@gmail.com signs up
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'adminFG@gmail.com' THEN
    -- Update the profile to have admin role
    UPDATE public.profiles 
    SET role = 'admin'::app_role 
    WHERE user_id = NEW.id;
    
    -- If no profile exists yet, the handle_new_user trigger will create it
    -- Then we update it to admin role
    IF NOT FOUND THEN
      -- Insert with admin role directly
      INSERT INTO public.profiles (user_id, email, display_name, role)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Admin User'),
        'admin'::app_role
      )
      ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::app_role;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to assign admin role for adminFG@gmail.com
CREATE OR REPLACE TRIGGER assign_admin_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_role();

-- Also create a function to manually assign admin role to existing users
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update or insert profile with admin role
  INSERT INTO public.profiles (user_id, email, display_name, role)
  VALUES (
    user_uuid,
    user_email,
    'Admin User',
    'admin'::app_role
  )
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::app_role;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The actual user account creation must be done through Supabase Auth
-- This setup ensures that when adminFG@gmail.com signs up, they get admin role automatically