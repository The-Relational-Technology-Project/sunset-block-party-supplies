-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Anyone can create supply requests" ON public.supply_requests;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can create supply requests" 
ON public.supply_requests 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);