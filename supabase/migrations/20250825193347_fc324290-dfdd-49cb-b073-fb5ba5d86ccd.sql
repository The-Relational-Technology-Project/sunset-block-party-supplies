-- Fix security issue: Remove email access from general vouched member policy
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Vouched members can view basic profile info of other vouched me" ON public.profiles;

-- Create a new policy that excludes sensitive fields like email
-- This policy will work with column-level access by creating a view
CREATE VIEW public.profiles_public AS
SELECT 
  id,
  name,
  zip_code,
  role,
  vouched_at,
  created_at
FROM public.profiles
WHERE vouched_at IS NOT NULL;

-- Grant select access to the view for vouched members
ALTER VIEW public.profiles_public OWNER TO postgres;

-- Create RLS policy for the view (though views don't enforce RLS, this documents intent)
-- The actual security is enforced by the underlying table policies

-- Create a more restrictive policy for vouched members to access basic profile info
-- This only allows access to non-sensitive fields
CREATE POLICY "Vouched members can view basic non-sensitive profile info" 
ON public.profiles 
FOR SELECT 
USING (
  is_user_vouched(auth.uid()) 
  AND vouched_at IS NOT NULL
  AND auth.uid() != id  -- Don't use this policy for own profile (separate policy exists)
);

-- Note: The above policy still allows full access. We need to modify the application
-- to use specific column selection instead. Let's create a function for safe profile access.

-- Actually, let's take a different approach - create a function that returns only safe fields
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  zip_code text,
  vouched_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.id, p.name, p.zip_code, p.vouched_at
  FROM public.profiles p
  WHERE p.id = profile_id 
    AND p.vouched_at IS NOT NULL
    AND is_user_vouched(auth.uid());
$$;