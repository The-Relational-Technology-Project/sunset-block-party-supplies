
-- First, remove the default value temporarily
ALTER TABLE public.join_requests ALTER COLUMN status DROP DEFAULT;

-- Add voucher_id to join_requests to track who invited someone
ALTER TABLE public.join_requests ADD COLUMN IF NOT EXISTS voucher_id UUID REFERENCES public.profiles(id);

-- Remove the separate approval status concept by removing join_request_status from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS join_request_status;

-- Update existing data first using the current enum values
-- Convert 'approved' to 'pending' temporarily (we'll handle vouching separately)
UPDATE public.join_requests SET status = 'pending' WHERE status = 'approved';

-- Now create the new enum type
CREATE TYPE public.join_request_status_new AS ENUM ('pending', 'vouched', 'rejected');

-- Change the column to use the new enum type
ALTER TABLE public.join_requests 
  ALTER COLUMN status TYPE public.join_request_status_new 
  USING status::text::public.join_request_status_new;

-- Drop the old enum and rename the new one
DROP TYPE public.join_request_status;
ALTER TYPE public.join_request_status_new RENAME TO join_request_status;

-- Restore the default value
ALTER TABLE public.join_requests ALTER COLUMN status SET DEFAULT 'pending'::public.join_request_status;

-- Update RLS policies to reflect new simplified system
DROP POLICY IF EXISTS "Stewards can update join requests" ON public.join_requests;

CREATE POLICY "Stewards can vouch via join requests"
  ON public.join_requests FOR UPDATE
  USING (public.is_user_steward(auth.uid()));

-- Add index for better performance on voucher lookups
CREATE INDEX IF NOT EXISTS idx_join_requests_voucher_id ON public.join_requests(voucher_id);
