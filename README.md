# Vibe — Influencer Search Platform

A modern, accessible influencer-discovery app built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Zustand**. Search creators across Instagram, YouTube and TikTok, view detailed profiles, and build a persistent shortlist.

**Live demo:** https://saanvirajput.github.io/wobb-assignment/

---

## ✨ Highlights

- Clean, responsive SaaS-style UI with a clear visual hierarchy
- Card-based search results with platform-aware branding
- Persistent "shortlist" (Add to list) backed by Zustand + `localStorage`
- Full keyboard accessibility, focus management, and reduced-motion support
- Route-level code splitting, memoised cards, and selector-based store reads
- Unit tests for the store and a CI pipeline that lints, tests, builds & deploys

---

## 🐛 Bugs & Issues Fixed

| Issue | Where | Root cause | Fix |
|---|---|---|---|
| **`npm install` crashed on a fresh clone** | `package.json` | `react-beautiful-dnd@13` (unused) declares a peer dependency on React ≤18, so installing on React 19 failed with `ERESOLVE` | Removed the dead dependency; install now works without `--legacy-peer-deps` |
| **Case-sensitive search** | `dataHelpers.ts` | Username/name matching didn't normalise case | Lower-cased both query and fields; trims whitespace |
| **Wrong "Engagements" stat** | `ProfileDetailPage.tsx` | Showed the engagement *rate* where the engagement *count* belonged | Separated the two stats and formatted each correctly |
| **Dead state causing re-renders** | `SearchPage.tsx` | An unused `clickCount` state was bumped on every search | Removed |
| **"Add to List" was a no-op** | `ProfileDetailPage.tsx` | Button was hardcoded `disabled` | Implemented fully via the Zustand store |
| **Broken avatars showed nothing** | `ProfileCard.tsx` | External image URLs can fail | Added an `onError` fallback that renders the creator's initial |
| **Home link broke under a base path** | `ErrorBoundary.tsx` | Hardcoded `/` ignored the GitHub Pages sub-path | Uses `import.meta.env.BASE_URL` |
| **Stale docs / unused files** | repo-wide | README described a theme the code no longer used; `SearchBar.tsx` and `formatFollowers` were dead | Rewrote docs, removed dead code, centralised formatters |

---

## 🗂️ State Management — React Context → Zustand

`src/store/useListStore.ts` uses Zustand with the `persist` middleware:

- **Actions:** `addProfile`, `removeProfile`, `toggleProfile`, `isSelected`, `clear`
- **Duplicate prevention:** keyed by `username` (a no-op if already present)
- **Persistence:** `localStorage` (`vibe-selected-profiles`, versioned) — the shortlist survives refreshes
- **Lean storage:** only a whitelisted set of summary fields is persisted, not the full API object
- **Performance:** components subscribe with selectors (`useListStore(s => s.isSelected(name))`) so a card only re-renders when *its own* selected state changes

Covered by **9 unit tests** in `useListStore.test.ts`.

---

## 🎯 "Select Profile & Add to List"

- Add from any search card or the profile detail page
- Toggling re-clicks remove the creator; duplicates are blocked
- A slide-in **Shortlist drawer** shows the selection with platform, handle and followers
- Remove individually, **Clear all**, or **Export as JSON**
- Persists across refreshes

---

## 🎨 UI / UX & Accessibility

- **Design:** white cards on a soft slate canvas with an indigo→violet accent and per-platform brand colours (Instagram gradient, YouTube red, TikTok dark/cyan)
- **Responsive:** 1 / 2 / 3-column grid across breakpoints; mobile-friendly header and drawer
- **Accessibility:** skip-to-content link, semantic landmarks, `role="tablist"` filters with `aria-selected`, `aria-pressed` toggles, `aria-live` result count, focus-visible rings, a modal drawer that traps focus, closes on `Escape`, and locks body scroll
- **Motion:** subtle Framer Motion entrance/stagger that respects `prefers-reduced-motion`

---

## ⚡ Performance

- `React.lazy` + `Suspense` route splitting (search and detail are separate chunks)
- `React.memo` on `ProfileCard` with `useCallback`-stabilised handlers
- `useMemo` for filtering/sorting; selector-based store subscriptions
- `loading="lazy"` images; profile JSON is dynamically imported only when a profile opens

---

## 🧱 Project Structure

```
src/
├─ components/   # Layout, ProfileCard/List, PlatformFilter, Drawer, VerifiedBadge, ErrorBoundary
├─ pages/        # SearchPage, ProfileDetailPage (lazy-loaded)
├─ store/        # useListStore (Zustand) + tests
├─ utils/        # dataHelpers, formatters, profileLoader, cn
├─ types/        # shared TypeScript types
└─ assets/data/  # sample search & profile JSON
```

---

## 📦 Libraries Added

| Library | Why |
|---|---|
| `zustand` | Lightweight state + persistence middleware |
| `framer-motion` | Accessible micro-interactions and list animations |
| `lucide-react` | Tree-shakeable icon set |
| `clsx` + `tailwind-merge` | Conflict-free conditional class composition (`cn`) |
| `vitest` (dev) | Fast, Vite-native unit tests |

---

## 🤔 Assumptions & Trade-offs

- **HashRouter** is used so deep links work on GitHub Pages static hosting without a server rewrite or `404.html`.
- `engagement_rate` is treated as a ratio (e.g. `0.0234` → `2.34%`).
- The shortlist persists to `localStorage` (no backend), so it's per-device.
- The drawer renders through a **portal** to escape the header's `backdrop-filter` stacking context.
- External avatar images may be unreachable in restricted networks; cards fall back to initials.

---

## 🚀 Deployment (GitHub Pages)

Deployment is automated via **GitHub Actions** (`.github/workflows/deploy.yml`): on every push to `main` it installs, lints, tests, builds, and publishes `dist/`.

One-time setup: **Repo → Settings → Pages → Build and deployment → Source: GitHub Actions.**

`vite.config.ts` sets `base: "/wobb-assignment/"` to match the repository name.

---

## 🛠️ Running Locally

```bash
npm install     # clean install (no flags needed)
npm run dev      # dev server → http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # ESLint
npm test         # Vitest unit tests
```

---

## 🔭 Remaining Improvements

- Dark-mode toggle with system-preference detection
- Virtualised lists for very large datasets
- End-to-end tests (Playwright) for the full add → persist → export flow
- Debounced search and URL-synced filters
