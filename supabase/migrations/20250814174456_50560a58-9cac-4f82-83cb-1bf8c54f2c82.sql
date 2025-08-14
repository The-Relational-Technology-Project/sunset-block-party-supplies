-- Add support for multiple images
ALTER TABLE public.supplies 
ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing single image_url to images array
UPDATE public.supplies 
SET images = CASE 
  WHEN image_url IS NOT NULL THEN ARRAY[image_url]
  ELSE '{}'
END;

-- We'll keep image_url for backward compatibility for now