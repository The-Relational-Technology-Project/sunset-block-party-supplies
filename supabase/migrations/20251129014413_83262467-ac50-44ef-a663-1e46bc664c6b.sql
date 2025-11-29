-- Update the handle_new_user function to store all signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, vouched_at, intro_text, zip_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    now(),  -- Automatically vouch new users
    NEW.raw_user_meta_data->>'connection_context',
    NEW.raw_user_meta_data->>'zip_code'
  );
  RETURN NEW;
END;
$$;