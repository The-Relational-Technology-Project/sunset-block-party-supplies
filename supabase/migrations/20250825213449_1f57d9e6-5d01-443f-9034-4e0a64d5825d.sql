-- Create a function to get safe profile info for supply listings
CREATE OR REPLACE FUNCTION public.get_supply_owner_info(owner_id_param uuid)
RETURNS TABLE(name text, zip_code text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.name, p.zip_code
  FROM public.profiles p
  WHERE p.id = owner_id_param 
    AND p.vouched_at IS NOT NULL
    AND is_user_vouched(auth.uid())
$$;

-- Allow vouched members to call this function
GRANT EXECUTE ON FUNCTION public.get_supply_owner_info(uuid) TO authenticated;