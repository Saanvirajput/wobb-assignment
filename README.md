# Wobb Frontend Assignment — Influencer Search Platform

A modern, high-performance influencer search application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

## 🔗 Links

- **Repository**: [github.com/Saanvirajput/wobb-assignment](https://github.com/Saanvirajput/wobb-assignment)

---

## What I Changed

### 1. Bugs Found & Fixed

| Bug | Location | Root Cause | Fix |
|---|---|---|---|
| **Stale `clickCount` state** | `SearchPage.tsx` | A `clickCount` state variable was incremented on every search but never used, causing unnecessary re-renders | Removed the dead state entirely |
| **Case-sensitive username search** | `dataHelpers.ts` | `filterProfiles` compared usernames with case-sensitive matching, so searching "cristiano" wouldn't find "Cristiano" | Added `.toLowerCase()` to both the query and the username field |
| **Wrong engagement stat display** | `ProfileDetailPage.tsx` | The "Engagements" stat was rendering `formatEngagementRate(engagement_rate)` (a percentage) instead of the actual `engagements` count | Changed to render `formatFollowersDetail(user.engagements)` |
| **Missing "Add to List" implementation** | `ProfileDetailPage.tsx` | The button was hardcoded as `disabled` with a `cursor-not-allowed` class and no click handler | Fully implemented with Zustand store integration |

### 2. State Management — React Context → Zustand

- Created `src/store/useListStore.ts` using Zustand with the `persist` middleware
- The store handles: `addProfile`, `removeProfile`, `isProfileAdded`
- **Persistence**: Selected profiles survive page refreshes via `localStorage`
- **Duplicate Prevention**: `addProfile` checks by username before inserting
- **7 unit tests** validate all store operations (see `useListStore.test.ts`)

### 3. UI/UX Redesign

- **Dark Mode**: Premium dark aesthetic with `bg-black` base and `zinc-900` surfaces
- **Typography**: Bold, uppercase, tightly tracked headings for a commanding visual presence
- **Animations**: Framer Motion for staggered list animations, card hover effects, and page transitions
- **Icons**: Lucide React for consistent, modern iconography
- **Responsive**: Fully responsive from mobile to desktop using Tailwind breakpoints

### 4. Accessibility

- **Skip-to-content** link for keyboard users
- **Semantic HTML**: `role="banner"`, `role="main"`, `aria-label` on nav, `aria-modal` on drawer
- **Keyboard navigation**: All interactive elements are `Tab`-focusable with visible focus rings
- **Drawer**: Closes on `Escape` key, traps focus, prevents body scroll when open
- **ARIA attributes**: `aria-label` on buttons, `role="tablist"` with `aria-selected` on platform filters

### 5. Performance Optimizations

- **Code Splitting**: `React.lazy` + `Suspense` for route-level lazy loading (`SearchPage` and `ProfileDetailPage` are separate chunks)
- **Memoization**: `React.memo` on `ProfileCard` to prevent unnecessary re-renders when sibling cards change
- **`useCallback`**: Stabilized event handlers in `ProfileCard` to work with `React.memo`
- **`useMemo`**: Profile filtering in `SearchPage` is memoized to avoid recalculation on unrelated state changes
- **Lazy Images**: `loading="lazy"` on all profile images

### 6. Code Quality

- **Folder Structure**: Clean separation — `components/`, `pages/`, `store/`, `utils/`, `types/`
- **Utility**: `cn()` helper (`clsx` + `tailwind-merge`) for conditional class merging
- **TypeScript**: Proper types throughout — no `any` usage
- **React Best Practices**: Components defined outside render, event handlers properly memoized

---

## Libraries Added

| Library | Purpose |
|---|---|
| `zustand` | Lightweight state management with built-in persistence middleware |
| `framer-motion` | High-performance animations and micro-interactions |
| `lucide-react` | Modern, tree-shakeable icon library |
| `clsx` + `tailwind-merge` | Conditional class name composition without conflicts |
| `vitest` (dev) | Fast, Vite-native unit testing framework |

---

## Assumptions Made

- The original React Context was intentionally left incomplete as a stub for candidates to replace
- The `engagement_rate` values in the JSON data represent raw ratios (not percentages), so `formatEngagementRate` from `formatters.ts` is the correct formatting function
- The "Add to List" feature uses `localStorage` persistence since no backend is provided

## Trade-offs

- **Portal for Drawer**: The drawer renders via `createPortal` to escape the header's `backdrop-filter` containing block — this adds complexity but solves a real CSS stacking context bug
- **localStorage over backend**: Keeps the app self-contained but limits list sharing across devices
- **Static JSON data**: Kept the original data loading approach rather than mocking an API layer, since the assignment focuses on UI and state management

## Remaining Improvements

- Add end-to-end tests (Playwright/Cypress) for full user flows
- Implement virtual scrolling for large datasets (`tanstack-virtual`)
- Add a CSV/PDF export option alongside JSON
- Dark/Light theme toggle with system preference detection

---

## Running Locally

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Production build
npm run lint       # ESLint
npx vitest run     # Run unit tests
```
