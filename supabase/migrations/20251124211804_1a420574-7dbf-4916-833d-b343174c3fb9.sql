-- Add lent_out status and private lender notes to supplies table
ALTER TABLE public.supplies 
  ADD COLUMN IF NOT EXISTS lent_out boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS lender_notes text;