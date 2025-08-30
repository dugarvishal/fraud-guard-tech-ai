-- Fix security issues: Update functions to have proper search_path setting

-- Fix assign_admin_role function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix make_user_admin function  
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;