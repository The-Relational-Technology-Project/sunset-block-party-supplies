
-- Create supply-images storage bucket for temporary AI analysis images
INSERT INTO storage.buckets (id, name, public)
VALUES ('supply-images', 'supply-images', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'supply-images'
  AND auth.uid() IS NOT NULL
);

-- Allow public read access (so AI gateway can fetch the image)
CREATE POLICY "Public read access for supply images"
ON storage.objects FOR SELECT
USING (bucket_id = 'supply-images');

-- Allow authenticated users to delete their uploaded files
CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'supply-images'
  AND auth.uid() IS NOT NULL
);
