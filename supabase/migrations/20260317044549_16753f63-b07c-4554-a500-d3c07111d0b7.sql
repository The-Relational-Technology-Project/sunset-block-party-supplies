CREATE TABLE public.community_steward_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  co_stewards jsonb DEFAULT '[]'::jsonb,
  reason text NOT NULL,
  questions text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

ALTER TABLE public.community_steward_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit"
  ON public.community_steward_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Stewards can view"
  ON public.community_steward_requests FOR SELECT
  USING (is_user_steward(auth.uid()));

CREATE POLICY "Stewards can update"
  ON public.community_steward_requests FOR UPDATE
  USING (is_user_steward(auth.uid()));