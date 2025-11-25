-- Create optimized function to get supplies with owner info in a single query
CREATE OR REPLACE FUNCTION get_supplies_with_owners()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  category text,
  condition text,
  party_types text[],
  date_available date,
  location text,
  neighborhood text,
  cross_streets text,
  contact_email text,
  image_url text,
  images text[],
  illustration_url text,
  house_rules text[],
  owner_id uuid,
  lent_out boolean,
  lender_notes text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  owner_name text,
  owner_zip_code text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    s.id,
    s.name,
    s.description,
    s.category,
    s.condition,
    s.party_types,
    s.date_available,
    s.location,
    s.neighborhood,
    s.cross_streets,
    s.contact_email,
    s.image_url,
    s.images,
    s.illustration_url,
    s.house_rules,
    s.owner_id,
    s.lent_out,
    s.lender_notes,
    s.created_at,
    s.updated_at,
    p.name as owner_name,
    p.zip_code as owner_zip_code
  FROM public.supplies s
  LEFT JOIN public.profiles p ON s.owner_id = p.id
  WHERE is_user_vouched(auth.uid())
    AND (p.vouched_at IS NOT NULL OR p.id IS NULL)
  ORDER BY s.created_at DESC
$$;