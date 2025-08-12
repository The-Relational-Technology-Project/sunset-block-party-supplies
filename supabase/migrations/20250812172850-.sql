-- Drop the overly permissive public profile policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create more secure profile access policies
CREATE POLICY "Users can view their own profile"
ON public.profiles 
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Stewards can view all profiles"
ON public.profiles 
FOR SELECT
USING (is_user_steward(auth.uid()));

CREATE POLICY "Vouched members can view basic profile info of other vouched members"
ON public.profiles 
FOR SELECT
USING (
  -- User must be vouched to see other vouched members
  is_user_vouched(auth.uid()) AND 
  -- Can only see profiles of other vouched members
  vouched_at IS NOT NULL
);