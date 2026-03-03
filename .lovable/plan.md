

## Redesigned Landing Page: Categories + Illustration Gallery

### Concept
Keep the hero section and category grid, but add a new "peek inside" section below it that shows a masonry-style grid of illustration thumbnails fetched from real supplies in the database. Just the drawings -- no names, no locations, no details. A visual window into what the community shares, encouraging visitors to join.

### Layout

```text
┌──────────────────────────────────────┐
│           Community Supplies         │
│   Borrow what you need. Share...     │
│       [Sign In] [Join Community]     │
├──────────────────────────────────────┤
│         What We're Sharing           │
│  [Tools] [Home] [Art] [Camping] ...  │  ← category chips (compact row)
├──────────────────────────────────────┤
│         A Peek Inside                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ 🎨 │ │ 🎨 │ │ 🎨 │ │ 🎨 │ │ 🎨 │ │  ← illustration-only grid
│  └────┘ └────┘ └────┘ └────┘ └────┘ │     (no text, no details)
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ 🎨 │ │ 🎨 │ │ 🎨 │ │ 🎨 │ │ 🎨 │ │
│  └────┘ └────┘ └────┘ └────┘ └────┘ │
│       [Join to browse all →]         │
├──────────────────────────────────────┤
│              Footer                  │
└──────────────────────────────────────┘
```

### Changes

**1. Modify `src/components/LandingPage.tsx`**
- Restructure the "What We're Sharing" section: replace the large category button grid with a compact horizontal row of category chips/pills (icon + name, scrollable on mobile)
- Add a new "A Peek Inside" section below categories that fetches supplies with `illustration_url` from the database (public read, no auth needed) and displays them in a tight grid of square illustration thumbnails
- Show up to ~15-20 illustrations, randomly sampled, no text overlays -- just the drawings on white backgrounds
- Add a subtle "Join to see all" CTA below the gallery
- Remove the faint background decoration images (they'll be replaced by real illustrations)

**2. Create a lightweight public query**
- Use `supabase.from('supplies').select('illustration_url').not('illustration_url', 'is', null).limit(20)` directly in the landing page component
- No auth required (RLS should allow public reads, or we use the anon key which is already configured)
- Only fetch `illustration_url` -- no personal data exposed

### Technical Notes
- The illustration grid items are not clickable (no supply details shown to unauthenticated users)
- Categories row uses horizontal flex-wrap on desktop, horizontal scroll on mobile
- Illustrations render in a CSS grid: 5 columns on desktop, 3 on tablet, 2 on mobile
- Each cell is a square with `aspect-square`, white background, `object-contain` with padding -- matching the existing `SupplyCard` illustration style

