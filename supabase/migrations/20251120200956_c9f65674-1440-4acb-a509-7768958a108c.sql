-- Add new fields to join_requests table
ALTER TABLE public.join_requests 
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN cross_streets text,
  ADD COLUMN referral_source text,
  ADD COLUMN phone_number text;

-- Make intro and connection_context nullable for backwards compatibility
ALTER TABLE public.join_requests 
  ALTER COLUMN intro DROP NOT NULL,
  ALTER COLUMN connection_context DROP NOT NULL;

-- Update RLS policy to allow users to view their own join request
CREATE POLICY "Users can view their own join request"
ON public.join_requests
FOR SELECT
USING (auth.uid() = user_id);