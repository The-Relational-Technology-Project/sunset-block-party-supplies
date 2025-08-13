-- Add missing columns to supplies table
ALTER TABLE public.supplies 
ADD COLUMN zip_code TEXT,
ADD COLUMN location TEXT,
ADD COLUMN image_url TEXT,
ADD COLUMN house_rules TEXT[];