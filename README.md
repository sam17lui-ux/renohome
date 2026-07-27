# Reno Board

A renovation tracker: plan the work, track a budget, and watch prices on the
products you're buying — all in one place. Built with Next.js 16 (App
Router), React 19, and TypeScript.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 for the marketing landing page, or
http://localhost:3000/app to go straight into the app (seeded with a demo
project, "Maple Street").

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # eslint
```

## How it's organised

```
app/
  page.tsx                 landing page
  app/page.tsx              /app route — reads ?start=1 to open onboarding
  api/product/route.ts      server-side product-link extractor
  error.tsx                  route-level error boundary
components/reno/
  landing.tsx                marketing page
  icons.tsx                  hand-built icon set (no icon library dependency)
  app/
    reno-app.tsx              top-level app state + all mutation handlers
    onboarding.tsx            3-step onboarding (name → rooms → budget)
    sidebar.tsx, app-header.tsx, overview.tsx, board.tsx, shopping.tsx
    modals.tsx                add-job / add-product / budget / detail modals
lib/reno/
  data.ts                     types, constants, seed data, formatting helpers
  compute.ts                  derives the entire view model from state
  storage.ts                  localStorage persistence (load/save + validation)
  extract.ts                  client helper for the extraction API
  style.ts                    parses inline CSS-string styles into React style objects
```

**State management:** `RenoApp` holds one `useState` object for the whole
app (UI state + domain data together) and derives everything the views need
via `computeApp()` in `lib/reno/compute.ts` on every render. There's no
memoization yet — see Known limitations.

## Persistence

Projects (jobs, products, budget) are saved to `localStorage` under the key
`reno-board:v1`, and reloaded on mount:

- **What's persisted:** `projects` and the active project id — the actual
  renovation data.
- **What's not:** which view/room filter you're on, open modals, drag state,
  in-progress onboarding — these reset to sensible defaults on reload by
  design.
- **Validation:** `lib/reno/storage.ts` structurally checks saved data before
  trusting it (right shape, non-empty). Anything corrupt or from an
  incompatible future schema is ignored and the app falls back to the seed
  project rather than crashing.
- **Known trade-off:** the very first render (both server and client) always
  shows the seed "Maple Street" data, then swaps to your saved data a moment
  later once a `useEffect` reads `localStorage`. This avoids a React
  hydration mismatch but means a brief flash of demo data is visible on
  reload before your real data appears.
- This is single-browser, single-device storage only — there's no account
  system and no server-side database, so data doesn't sync across devices or
  survive clearing site data.

## Product price extraction (`/api/product`)

Pasting a product link calls a server-side route that fetches the page and
reads its structured metadata — JSON-LD `Product`, then Open Graph, then
plain `<meta>` tags — to pull out a name, price, and retailer (mapped to a
known list, or `Other`). It's retailer-agnostic by design: it doesn't scrape
any specific site's markup, just the metadata most product pages already
publish.

Current safeguards: request timeout, a response-size cap, and a check that
rejects private/internal hostnames before fetching.

**Known gap:** the private-host check only runs on the URL as given — it
isn't re-applied to redirect targets, so a URL that redirects to an internal
address wouldn't currently be caught. This is the top item to fix before
this endpoint is exposed publicly without additional protection (see
`/api/product/route.ts` for the fetch call in question).

There's also no rate limiting or auth on this route yet, so it shouldn't be
treated as production-hardened as-is.

## Known limitations

- **No backend or accounts.** Everything lives in the browser. There's no
  multi-device sync, no sharing, no server-side backup.
- **No automated tests or CI.** Nothing currently runs `tsc`/lint/tests on
  push — that's the next highest-value addition.
- **`Job.due` is a free-text string** (e.g. `"Due 18 Jun"`), parsed with a
  regex and assumed to be this year unless that reads as more than ~6 months
  in the past. It's a reasonable approximation for demo data, but a real
  due-date field should just be a stored date, not a string to parse.
- **No memoization.** `computeApp()` recomputes the full view model on every
  render, including while typing in a modal. Fine at the current data
  volumes; worth addressing before this scales.
- Some retailers block server-side fetches or render price via client-side
  JS, so extraction will fall back to manual entry for those.

## License

Private project, not licensed for reuse.
