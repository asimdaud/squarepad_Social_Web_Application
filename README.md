# SquarePad

SquarePad is a polished social product demo built for portfolio and interview use. It started as an older full-stack social app and was rebuilt into a local-first experience that still shows the shape of a real product: feed, profiles, messaging, groups, admin insights, theming, and motion.

Live demo: https://squarepad-demo-fix.web.app

## What It Shows

- Interactive timeline with likes, comments, sharing, and post deletion
- Editable self profile with app-wide identity propagation
- Cross-linked user profiles from posts, comments, messages, and groups
- Local messaging threads with persistent demo state
- Interactive groups with membership, members, and activity
- Admin dashboard powered by real demo-derived metrics
- Light default theme plus switchable dark mode

## Tech

- React 16
- Vite
- React Router
- Reactstrap + custom CSS
- Framer Motion
- Firebase Hosting

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

Manual Firebase deploy:

```bash
npm run deploy:firebase
```

This repo also supports automatic Firebase Hosting deploys through GitHub Actions:

- push to `main` or `master` -> deploy live
- open a pull request -> create a preview deploy

GitHub Actions requires this repository secret:

- `FIREBASE_SERVICE_ACCOUNT_SQUAREPAD_DEMO_FIX`

## Notes

- Demo data is local-first and persists in the browser
- Remote images have fallbacks so the UI still holds up if external assets fail
- The project was migrated from CRA to Vite to simplify the build and reduce legacy dependency noise
