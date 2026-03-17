

## Phase 1: Homepage Overhaul + "Start a Community" Intake Form

The goal: a visitor from a Washington Post article lands on communitysupplies.org and immediately understands (1) what this is, (2) sees the Sunset & Richmond community as proof it works, and (3) can easily start their own sharing community.

### Landing Page Redesign

The current `LandingPage.tsx` is built for a single community. We restructure it into three clear sections:

**Section 1 — Hero (updated)**
- Keep "Community Supplies" title and tagline
- Add a brief explainer line: "A free tool for neighborhoods to share supplies, tools, and more."
- Two primary CTAs side by side:
  - "Browse Sunset & Richmond" (existing sign-in flow for the flagship community)
  - "Start a Sharing Community" (links to `/start-community`)

**Section 2 — How It Works**
- 3 simple steps with icons: "Start a community" → "Invite your neighbors" → "Share and borrow"
- Clean, on-brand cards or columns

**Section 3 — Community Directory**
- Header: "Active Communities"
- For now, just one entry: "Sunset & Richmond, SF" with a brief description and member count (or just "founding community")
- Styled as a clean list/card — room to grow as communities are added
- Below the directory: a CTA card — "Want to start a sharing community in your neighborhood?" with a link to `/start-community`

**Section 4 — Illustration gallery (keep as-is)**

**Section 5 — Footer (keep as-is)**

### New `/start-community` Page + Intake Form

**Database: `community_steward_requests` table**

New migration:
```sql
CREATE TABLE public.community_steward_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  co_stewards jsonb DEFAULT '[]',
  reason text NOT NULL,
  questions text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

ALTER TABLE public.community_steward_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (rate limited by captcha on frontend)
CREATE POLICY "Anyone can submit"
  ON public.community_steward_requests FOR INSERT
  WITH CHECK (true);

-- Stewards can view all
CREATE POLICY "Stewards can view"
  ON public.community_steward_requests FOR SELECT
  USING (is_user_steward(auth.uid()));

-- Stewards can update status
CREATE POLICY "Stewards can update"
  ON public.community_steward_requests FOR UPDATE
  USING (is_user_steward(auth.uid()));
```

**New page: `src/pages/StartCommunity.tsx`**
- Simple page wrapper with CatalogHeader-like branding (or a minimal header with just the logo)
- Renders the intake form component

**New component: `src/components/community/StartCommunityForm.tsx`**
- On-brand card form, similar style to `JoinRequestForm`
- Fields:
  - Your name (required)
  - Your email (required)
  - Co-stewards: repeatable name + email pairs (add/remove, stored as JSON array)
  - "Why do you want to start a sharing community?" (textarea, required)
  - "Any questions for us?" (textarea, optional)
  - Math captcha
- Submits to `community_steward_requests` table
- Triggers a notification email via a new edge function `send-community-request-notification`
- Success state: friendly confirmation message

**New edge function: `supabase/functions/send-community-request-notification/index.ts`**
- Sends an email to the site admin (using Resend, same pattern as `send-join-notification`)
- Includes all form fields in the email body

**Route: Add `/start-community` to `App.tsx`**

### Steward Dashboard Addition

**New component: `src/components/steward/CommunityRequestsManager.tsx`**
- Table view of `community_steward_requests` (similar to `JoinRequestsManager`)
- Shows name, email, reason, status, date
- Expandable to see co-stewards and questions

**Add tab to `StewardDashboard.tsx`**
- New "Community Requests" tab alongside existing tabs

### Files to create
- `src/pages/StartCommunity.tsx`
- `src/components/community/StartCommunityForm.tsx`
- `src/components/steward/CommunityRequestsManager.tsx`
- `supabase/functions/send-community-request-notification/index.ts`
- 1 database migration

### Files to modify
- `src/components/LandingPage.tsx` — full redesign with directory section and dual CTAs
- `src/App.tsx` — add `/start-community` route
- `src/components/steward/StewardDashboard.tsx` — add Community Requests tab

