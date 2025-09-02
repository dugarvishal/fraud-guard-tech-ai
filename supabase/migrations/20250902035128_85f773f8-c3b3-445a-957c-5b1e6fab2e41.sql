-- Create the admin user account with proper auth setup
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Insert into auth.users with a proper UUID and required fields
    INSERT INTO auth.users (
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
    ) VALUES (
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'adminFG@gmail.com',
        crypt('Password@01', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"display_name": "Admin User"}',
        false,
        '',
        '',
        '',
        ''
    ) RETURNING id INTO new_user_id;

    -- Insert into profiles with admin role
    INSERT INTO public.profiles (user_id, email, display_name, role)
    VALUES (
        new_user_id,
        'adminFG@gmail.com',
        'Admin User',
        'admin'::app_role
    );
END
$$;