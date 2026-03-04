

## Align Fonts, Colors, and Button Styles

### Problems Found

Looking at the screenshot and code, there are several visual inconsistencies:

1. **Two different headers**: `CatalogHeader` (sand bg, serif title, clean) vs `Header` (gradient bg with orange/peach, bolder, has navigation). The `Header` uses a garish `bg-gradient-to-r from-primary to-accent` that clashes with the landing page's calm sand tone.

2. **AuthButtons uses orange-500/600** (`text-orange-600 border-orange-600 hover:bg-orange-50`, `bg-orange-500 hover:bg-orange-600`) instead of the design system's terracotta. "Join the Party" copy also doesn't match "Join Our Community" on the landing page.

3. **Category chips on landing** use `rounded-full` (pill shape) while buttons in the design system use `rounded-sm`. This is intentional and fine for chips, but worth noting.

4. **Landing page buttons** override with inline classes (`rounded-sm`, explicit colors) instead of relying on button variants.

5. **Header.tsx** is used on sub-pages (MySupplies, Steward, etc.) and has a completely different visual language from `CatalogHeader` which is used on the main Index page.

### Plan

**1. Fix `src/components/auth/AuthButtons.tsx`**
- Replace `orange-500/600` with `terracotta` from the design system
- Change "Join the Party" to "Join Our Community" for consistency
- Use button variants instead of inline color overrides

**2. Fix `src/components/Header.tsx`**
- Replace gradient background (`bg-gradient-to-r from-primary to-accent`) with solid `bg-sand` + `border-b border-border` to match `CatalogHeader`
- Change text colors from `text-primary-foreground` to `text-deep-brown`
- Update nav button hover states to use `hover:bg-sand/20` instead of white-on-gradient styles
- Remove the Gift icon and tagline subtitle to match the cleaner `CatalogHeader` style

**3. Clean up `src/components/LandingPage.tsx` buttons**
- Remove redundant inline style overrides on the CTA buttons (explicit `bg-terracotta`, `rounded-sm`, `min-h-[48px]`) and rely on the button variants + `size="lg"` which already handle this
- Keep `border-2 border-terracotta` on the outline variant since the default outline border is thinner

**4. Ensure consistent font usage**
- Headings (`h1-h6`): serif (already set in `index.css` base layer) -- no changes needed
- Body text, buttons, labels: sans-serif (already the default) -- just need to remove any stray `font-serif` on non-heading elements
- Supply card item names use `font-serif` which is appropriate (they're titles)
- The `Header.tsx` title should use `font-serif` to match `CatalogHeader`

### Result
All pages share the same sand-toned header bar, terracotta accent color, consistent button shapes from the variant system, and clear serif-for-headings / sans-for-everything-else typography.

