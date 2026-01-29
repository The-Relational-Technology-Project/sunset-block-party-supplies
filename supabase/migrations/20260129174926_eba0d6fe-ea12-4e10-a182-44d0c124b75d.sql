-- Create books table for community book library
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  condition TEXT NOT NULL DEFAULT 'good',
  house_rules TEXT[] DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lent_out BOOLEAN DEFAULT FALSE,
  lender_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only vouched users can view books
CREATE POLICY "Vouched members can view all books"
ON public.books
FOR SELECT
USING (is_user_vouched(auth.uid()));

-- Only owner AND vouched can insert
CREATE POLICY "Vouched owners can insert their own books"
ON public.books
FOR INSERT
WITH CHECK ((auth.uid() = owner_id) AND is_user_vouched(auth.uid()));

-- Only owner AND vouched can update
CREATE POLICY "Vouched owners can update their own books"
ON public.books
FOR UPDATE
USING ((auth.uid() = owner_id) AND is_user_vouched(auth.uid()));

-- Only owner AND vouched can delete
CREATE POLICY "Vouched owners can delete their own books"
ON public.books
FOR DELETE
USING ((auth.uid() = owner_id) AND is_user_vouched(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster searches
CREATE INDEX idx_books_owner_id ON public.books(owner_id);
CREATE INDEX idx_books_title ON public.books USING GIN(to_tsvector('english', title));

-- Create RPC function to get books with owner names
CREATE OR REPLACE FUNCTION public.get_books_with_owners()
RETURNS TABLE(
  id UUID,
  title TEXT,
  author TEXT,
  genre TEXT,
  condition TEXT,
  house_rules TEXT[],
  owner_id UUID,
  lent_out BOOLEAN,
  lender_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  owner_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
    p.name as owner_name
  FROM public.books b
  LEFT JOIN public.profiles p ON b.owner_id = p.id
  WHERE is_user_vouched(auth.uid())
    AND (p.vouched_at IS NOT NULL OR p.id IS NULL)
  ORDER BY b.title ASC
$$;