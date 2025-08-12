-- Remove the vouches table since it's no longer being used
DROP TABLE IF EXISTS public.vouches;

-- Secure database functions by setting proper search_path

-- Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, vouched_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    now()  -- Automatically vouch new users
  );
  RETURN NEW;
END;
$$;

-- Update is_user_vouched function with proper search_path
CREATE OR REPLACE FUNCTION public.is_user_vouched(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT vouched_at IS NOT NULL
  FROM public.profiles
  WHERE id = user_id;
$$;

-- Update is_user_steward function with proper search_path  
CREATE OR REPLACE FUNCTION public.is_user_steward(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role = 'steward'
  FROM public.profiles
  WHERE id = user_id;
$$;