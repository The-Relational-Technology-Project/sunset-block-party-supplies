-- Create storage bucket for email assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-assets', 'email-assets', true);

-- Allow public read access to email assets
CREATE POLICY "Public can view email assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'email-assets');

-- Only stewards can upload email assets
CREATE POLICY "Stewards can upload email assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'email-assets' 
  AND public.has_role(auth.uid(), 'steward'::public.app_role)
);

-- Stewards can delete email assets
CREATE POLICY "Stewards can delete email assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'email-assets' 
  AND public.has_role(auth.uid(), 'steward'::public.app_role)
);