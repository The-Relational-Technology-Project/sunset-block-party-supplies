
-- Update the vouches RLS policy to allow vouched members (not just stewards) to create vouches
DROP POLICY IF EXISTS "Stewards can create vouches" ON public.vouches;

CREATE POLICY "Vouched members can create vouches"
  ON public.vouches FOR INSERT
  WITH CHECK (public.is_user_vouched(auth.uid()));

-- Add a supplies table for the community party supplies
CREATE TABLE public.supplies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair')),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_available DATE,
  party_types TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for supplies
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for supplies - vouched members can view and manage
CREATE POLICY "Vouched members can view all supplies"
  ON public.supplies FOR SELECT
  USING (public.is_user_vouched(auth.uid()));

CREATE POLICY "Users can insert their own supplies"
  ON public.supplies FOR INSERT
  WITH CHECK (auth.uid() = owner_id AND public.is_user_vouched(auth.uid()));

CREATE POLICY "Users can update their own supplies"
  ON public.supplies FOR UPDATE
  USING (auth.uid() = owner_id AND public.is_user_vouched(auth.uid()));

CREATE POLICY "Users can delete their own supplies"
  ON public.supplies FOR DELETE
  USING (auth.uid() = owner_id AND public.is_user_vouched(auth.uid()));
