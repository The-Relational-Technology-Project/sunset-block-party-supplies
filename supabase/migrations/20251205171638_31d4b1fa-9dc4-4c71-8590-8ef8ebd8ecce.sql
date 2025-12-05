-- Create a rate limiting function for join requests
CREATE OR REPLACE FUNCTION public.check_join_request_rate_limit(request_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(*) < 3
  FROM public.join_requests
  WHERE email = request_email
    AND requested_at > now() - interval '1 hour';
$$;

-- Update the INSERT policy to include rate limiting
DROP POLICY IF EXISTS "Anyone can insert join requests" ON public.join_requests;

CREATE POLICY "Rate limited join request submissions" 
ON public.join_requests 
FOR INSERT 
WITH CHECK (check_join_request_rate_limit(email));