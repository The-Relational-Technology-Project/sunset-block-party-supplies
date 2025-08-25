-- Fix security issues from previous migration
-- Drop the problematic SECURITY DEFINER view
DROP VIEW IF EXISTS public.profiles_public;

-- Fix the function to have proper search path and remove SECURITY DEFINER
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

-- Create a proper function with fixed search path
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  zip_code text,
  vouched_at timestamp with time zone
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.name, p.zip_code, p.vouched_at
  FROM public.profiles p
  WHERE p.id = profile_id 
    AND p.vouched_at IS NOT NULL
    AND is_user_vouched(auth.uid());
$$;

-- The real fix is in the application code - we need to modify queries to only select
-- specific columns instead of allowing access to email addresses
-- The RLS policy is still in place and will prevent access, but we should be explicit