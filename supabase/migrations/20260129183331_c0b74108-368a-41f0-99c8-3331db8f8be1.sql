-- Drop and recreate get_books_with_owners to include owner_email for email notifications
DROP FUNCTION IF EXISTS public.get_books_with_owners();

CREATE FUNCTION public.get_books_with_owners()
 RETURNS TABLE(
   id uuid, 
   title text, 
   author text, 
   genre text, 
   condition text, 
   house_rules text[], 
   owner_id uuid, 
   lent_out boolean, 
   lender_notes text, 
   created_at timestamp with time zone, 
   updated_at timestamp with time zone, 
   owner_name text,
   owner_email text
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    b.id,
    b.title,
    b.author,
    b.genre,
    b.condition,
    b.house_rules,
    b.owner_id,
    b.lent_out,
    b.lender_notes,
    b.created_at,
    b.updated_at,
    p.name as owner_name,
    p.email as owner_email
  FROM public.books b
  LEFT JOIN public.profiles p ON b.owner_id = p.id
  WHERE is_user_vouched(auth.uid())
    AND (p.vouched_at IS NOT NULL OR p.id IS NULL)
  ORDER BY b.title ASC
$function$;