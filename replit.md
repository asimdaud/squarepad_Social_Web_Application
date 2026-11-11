# Project notes

- Squarepad is a local-first travel community demo. Keep the product name Squarepad unless the user asks to change it. Traveller profiles, posts, stories, groups, trips, and messages use static demo data and browser storage.
- Displayed counts, rankings, profile trip totals, and map heat must be calculated from the current posts, reactions, saves, and follow graph; do not add seeded popularity totals.
- The map uses interactive OpenStreetMap tiles; user-added places and social activity remain local to the browser.
- Sign-in screens are visual demonstrations only. Do not add real authentication, collect credentials, or introduce a backend unless explicitly requested.
- Start the Replit preview with `npm run dev`. The Vite server listens on port 5000 and accepts Replit's proxied host.
- Build with `npm run build`.
- Firebase Hosting deployment is handled by the repository's GitHub Actions workflow on pushes to `main` or `master`.
