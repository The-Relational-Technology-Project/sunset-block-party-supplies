

## Replace Dynamic Illustration Query with Cached Set

### Approach
Instead of calling `get_public_illustrations()` (with `ORDER BY random()`) on every page load, store a curated set of illustration URLs in a `site_config` table. The landing page reads this single cached row. A steward can click "Refresh Illustrations" to pull a new random set whenever they want.

### Changes

**1. Database migration: Create `site_config` table**
- Single-row table with a `key` (text, primary key) and `value` (jsonb)
- Insert one row: key = `landing_illustrations`, value = JSON array of illustration URLs
- Public SELECT policy (no auth needed for landing page)
- Steward-only UPDATE policy
- Seed it with the current `get_public_illustrations()` output

```sql
CREATE TABLE public.site_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Public read, steward write
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Stewards can update" ON public.site_config FOR UPDATE USING (is_user_steward(auth.uid()));

-- Seed with current random illustrations
INSERT INTO public.site_config (key, value)
SELECT 'landing_illustrations', jsonb_agg(illustration_url)
FROM (SELECT illustration_url FROM public.supplies WHERE illustration_url IS NOT NULL ORDER BY random() LIMIT 20) sub;
```

**2. Modify `src/components/LandingPage.tsx`**
- Replace `supabase.rpc('get_public_illustrations')` with a simple query: `supabase.from('site_config').select('value').eq('key', 'landing_illustrations').single()`
- Parse the JSON array of URLs from `value`
- Remove loading skeleton (this query returns instantly and is cached by React Query)

**3. Add "Refresh Landing Illustrations" button to Steward Dashboard**
- Add a button in `src/components/steward/StewardDashboard.tsx` (or a small new component)
- On click: call `get_public_illustrations()` RPC to get a fresh random set, then update `site_config` with the new array
- This is the monthly manual refresh the user described

**4. No changes to edge functions or the existing RPC**
- Keep `get_public_illustrations()` around -- it's still useful as the randomization source when the steward clicks refresh

### Result
- Landing page: one tiny read from `site_config` (cached), no random table scan
- Steward refreshes illustrations whenever they want via dashboard button
- Disk IO budget impact: near zero

