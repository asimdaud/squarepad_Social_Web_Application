# Squarepad

Squarepad is a travel-social demo for sharing trip notes, finding local recommendations, and seeing where other travellers have been. It uses static demo records and browser storage; there is no backend or real sign-in.

Live demo: https://squarepad-demo-fix.web.app

## What It Shows

- A travel feed with stories, location-tagged posts, likes, comments, saves, and post creation
- Searchable destination discovery with place creation, map pin selection, and trip-note-based heatmaps
- A pan-and-zoom OpenStreetMap view with saved local places and weighted activity from real demo posts, likes, comments, and saves
- Linked traveller profiles with local editing and follow states
- Persistent demo conversations and travel communities
- Community insights calculated from the local demo state
- Presentation-only welcome and sign-in screens at `/welcome` and `/login`

## Local Development

```bash
npm ci
npm run dev
```

Vite listens on port 5000 for the Replit preview. Build and preview the production bundle with:

```bash
npm run build
npm run preview
```

## Demo Data

Seed profiles, posts, groups, conversations, and trip coordinates live in `src/demo/demoStorage.js`. Social changes and user-added map locations persist in localStorage, and existing Wayfarer demo data is migrated on first load. Counts and heatmap weights are derived from the current posts, likes, comments, saves, and follow graph, not seeded popularity totals. The map uses OpenStreetMap tiles and needs no API key; map tiles require an internet connection.

## Deployment

GitHub Actions deploys Firebase Hosting on pushes to `main` or `master`; pull requests create preview deployments. The workflow expects the repository secret `FIREBASE_SERVICE_ACCOUNT_SQUAREPAD_DEMO_FIX`.

Manual Firebase deploy:

```bash
npm run deploy:firebase
```
