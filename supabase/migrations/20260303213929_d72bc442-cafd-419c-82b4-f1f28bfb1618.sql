
CREATE OR REPLACE FUNCTION public.get_public_illustrations()
RETURNS TABLE(illustration_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT s.illustration_url
  FROM public.supplies s
  WHERE s.illustration_url IS NOT NULL
  ORDER BY random()
  LIMIT 20;
$$;
