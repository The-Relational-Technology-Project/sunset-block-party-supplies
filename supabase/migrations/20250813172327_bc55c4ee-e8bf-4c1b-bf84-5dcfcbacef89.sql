-- Add contact email field to supplies table
ALTER TABLE public.supplies 
ADD COLUMN contact_email TEXT;