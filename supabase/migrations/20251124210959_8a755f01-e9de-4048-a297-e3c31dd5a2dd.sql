-- Add neighborhood and cross_streets columns to supplies table
-- Keep zip_code for backward compatibility with existing data
ALTER TABLE public.supplies 
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS cross_streets text;