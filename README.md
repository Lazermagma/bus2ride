# Bus2Ride

Party bus, limousine, and coach bus rental platform built with **Next.js 16 (App Router)**, **Supabase**, **Tailwind CSS**, and **shadcn/Radix**.

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router, TypeScript) |
| Styling    | Tailwind CSS, CSS variables         |
| Theme      | Blue-centric (`#2563eb` primary)    |
| Components | shadcn UI (Radix primitives)        |
| Backend    | Supabase (PostgreSQL)               |
| Auth       | Supabase SSR (cookie-based)         |
| Storage    | Supabase bucket `vehicles1`         |
| Icons      | Lucide React                        |

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Deployment

### Vercel (Recommended)

This project is configured for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy!

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

**Optional Environment Variables:**
- `OPENWEATHER_API_KEY` - For weather features
- `TOMTOM_API_KEY` - For traffic features

---

## Global Component Rules

### Hero Section

- **Used on:** All pages **except** Fleet pages, Polls page, Poll Results page.
- Fetch hero by slug from Supabase.
- Rotating carousel of 3 vehicle images from `vehicles1` storage.

### Fleet Preview Section

- Large main photo + small thumbnails below.
- **"Learn More"** button in bottom-right of main photo.
- Fix pixelated buttons (match hero button quality).
- Increase contrast for "Chauffeur Included" badge (white text hard to see).
- **Homepage only:** Show left/right arrows; clicking anywhere routes to fleet page.
- Never show same vehicle twice across sections.
- Thumbnail click should instantly update main photo (no stall).

### "Why X Rocks" Section

- Use expanded version from fleet pages (not homepage mini version).
- Store in Supabase as `content_sections`.
- Modal styling should match Tools page modal (better looking).

### Reviews Section

- Add **search bar** + **checkbox filters** (filter by vehicle type, "on time", etc.).
- AI-assisted tagging for filter categories.
- Consistent across all pages.

### Polls Section

- **3-column layout:**
  - Column 1 = contextual poll for current page category
  - Columns 2–3 = AI-suggested/rotated polls
- Recreate styling to match site theme.

### Tools Section

- Grid layout with **modal popups** (use Tools page modal style everywhere).
- Rotate tools contextually (e.g., pricing tools on pricing page).
- Store in Supabase for dynamic rotation.

### Events Section

- **Desktop:** 2 rows × 3 columns (6 events), randomized order.
- **Mobile:** Stacked.
- "See more events" button below.
- Change "Related Polls" button → **"Live Quote"**.

### FAQ Section

- Supabase-driven template with "See more" expansion.
- **Page-context filtering** — vast majority should be unique per page.
- Some FAQs can repeat across pages but keep it minimal.

---

## Page-Specific Instructions

### Homepage (`/`)

- Standard Hero
- Fleet Preview sections: Party Bus → Limo → Coach Bus
- Replace mini "Why X Rocks" with expanded fleet page version
- **Stack:** Reviews → Polls → Tools → FAQ → Events (6 events grid)

### Fleet Pages (`/party-buses`, `/limousines`, `/coach-buses`)

- **No hero**
- Search bar + checkbox filters at top for sorting/finding vehicles
- Thumbnail click instantly updates main photo + "Learn More" button
- "Why X Rocks" section (expanded)
- Cross-sell: "We also have [other vehicle types]" section
- "How the Bus2Ride Booking Process Works" section (from Supabase)
- **Stack:** Reviews → Polls → Tools → Events → FAQ

### Individual Vehicle Page (`/vehicles/[slug]`)

- **Larger fonts, more blue** styling
- Remove spec sheet
- Show 3 related vehicles of same type + "Why X Rocks"
- Cross-sell other categories (party buses, limos, coach buses)
- **Stack:** Reviews → Polls → Tools → Events → FAQ

### Events Page (`/events`)

- Standard Hero
- Grid styling (boxes not rectangles)
- **Stack:** Reviews → Polls → Fleet sections → Tools → FAQ

### Individual Event Page (`/events/[slug]`)

- Remove: scrolling bar/CTA at bottom, "Plug in your city", "Set mood before you roll"
- Move "Make the scares fun not stressful" section up near top content
- Show more related events (not "popular vehicles")
- **Stack:** Fleet sections → Polls → Tools → Reviews → FAQ

### Pricing Page (`/pricing`)

- Standard Hero
- Prominent search bar + clickable filters (minimum hours, vehicle type, etc.)
- **Stack:** Reviews → Polls → Fleet sections → Tools → FAQ → Events (6 grid)

### Locations Directory (`/locations`)

- Current layout is fine
- **Stack:** Polls → Fleet sections → Tools → Reviews → FAQ

### City Location Page (`/locations/state/[state_slug]/city/[city_slug]`)

- Standard Hero at top
- **Larger fonts** (match rest of site)
- Events section: convert to **modals** (square boxes, not rectangles)
- Sample itinerary section: add photo on left, more detail
- Neighborhood vibes + Seasonal guide: convert to **modals**
- Trivia/Fun facts: bigger font, more items, better organization, more "spicy"
- **Live Conditions:** Expand section with live weather + traffic APIs (free APIs preferred)
- Remove "Supabase powered social proof" section
- **Stack:** Reviews → Polls → Fleet sections → Tools → Events → FAQ → "Ready to Plan" CTA

### State Location Page (`/locations/state/[state_slug]`)

- Use **same template as city pages** (apply all city page changes first)

### City Vehicle Pages (`/locations/state/[state_slug]/city/[city_slug]/[fleet_slug]`)

- Create 3 pages per city: party-buses, limousines, coach-buses
- Follow city location template pattern

### Polls Page (`/polls`)

- **No Hero**
- Improve UX for faster voting (reduce clicks needed)
- **Stack:** Reviews → Fleet sections → Tools → Events → FAQ

### Poll Results Page (`/poll-results`)

- **No Hero**
- Top section: "Cool Stats" (most popular poll, interesting facts)
- Simple grid for browsing results by category
- **Stack:** Fleet sections → Polls → Reviews → Tools → Events → FAQ

### Blog Page (`/blog`)

- Standard Hero
- Fix images from Supabase storage
- Intersperse CTAs/info blocks between blog rows (break up monotony)
- Search bar + checkbox filters for blog categories
- Amenity tags below post images should be **clickable filters**
- **Stack:** Fleet sections → Reviews → Polls → Tools → Events → FAQ

### Individual Blog Post (`/blog/[slug]`)

- Contextual Hero from Supabase
- Add proper **title** to blog post
- Remove: "Build your own model", "From inquiry to rolling wheels", "Actual vehicles staged this week", "Playbooks"
- Use Supabase FAQ section
- Keep "Interactive estimator" and "Cost signals" only if relevant to post topic
- **Stack:** Fleet sections → Polls → Tools → FAQ → Events

### Tools Page (`/tools`)

- Standard Hero
- Remove "Launch ready charter ops stack" section
- Fix circle icon UI issue
- Modal style is great — use this modal pattern elsewhere
- **Stack:** Fleet sections → Reviews → Polls → FAQ → Events

### FAQ Page (`/faq`)

- Standard Hero
- FAQ-specific header at top
- **More blue, less dark** (match site theme)
- Add "Most Clicked Questions This Week" section
- **Stack:** Reviews → Fleet sections → Polls → Events → Tools

### Industry Secrets Page (`/industry-secrets`)

- Standard contextual Hero
- Standardize boxes to match site styling (not current "dumb" look)
- Modal style should match Tools page modals
- Keep CTAs/info that break up rows
- Prominent search bar + checkbox filters by category
- **Stack:** Fleet sections → Polls → Reviews → Events → Tools → FAQ

### Reviews Page (`/reviews`)

- Standard Hero
- **More blue, less dark** styling
- **Stack:** Fleet sections → Polls → Events → Tools → FAQ

### Contact Page (`/contact`)

- Standard Hero
- Higher contrast form (currently hard to see)
- Remove "Lock in my quote" (ballpark numbers OK)
- Replace "Response SLA" with Trivia/Facts
- Add "How to Book" section from Supabase
- **Stack:** Fleet sections → Reviews → Polls → Events → FAQ

---

## External APIs Needed

| Feature          | API                         | Notes                |
| ---------------- | --------------------------- | -------------------- |
| Live Weather     | OpenWeatherMap / WeatherAPI | Free tier available  |
| Live Traffic     | Google Maps / TomTom        | May require signup   |
| Additional feeds | TBD                         | Prioritize free APIs |

---

## Key Files Reference

| Purpose                 | Path                      |
| ----------------------- | ------------------------- |
| Supabase server client  | `lib/supabase/server.ts`  |
| Supabase browser client | `lib/supabase/client.ts`  |
| Cookie/session proxy    | `lib/supabase/proxy.ts`   |
| DB types                | `types/database.types.ts` |
| Vehicle data helpers    | `lib/data/vehicles.ts`    |
| UI primitives           | `components/ui/`          |
| Page sections           | `components/sections/`    |

---

## Implementation Priority

1. Fix Fleet Preview section (buttons, contrast, thumbnail click, arrows)
2. Implement Reviews section with search + filters
3. Recreate Polls section (3-column layout)
4. Standardize modal styling (use Tools modal everywhere)
5. Build Events grid (6 events + "See more")
6. Apply page-specific stacks
7. Integrate weather/traffic APIs for location pages
8. Style consistency pass (more blue, larger fonts where noted)
