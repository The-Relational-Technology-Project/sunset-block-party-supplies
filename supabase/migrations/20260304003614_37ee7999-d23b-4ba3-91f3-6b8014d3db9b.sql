CREATE TABLE public.site_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Stewards can update" ON public.site_config FOR UPDATE USING (is_user_steward(auth.uid()));

INSERT INTO public.site_config (key, value)
SELECT 'landing_illustrations', jsonb_agg(illustration_url)
FROM (SELECT illustration_url FROM public.supplies WHERE illustration_url IS NOT NULL ORDER BY random() LIMIT 20) sub;