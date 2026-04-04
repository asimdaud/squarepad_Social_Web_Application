# SquarePad Demo

SquarePad is now a portfolio-safe social product demo built with React and Firebase Hosting. It preserves the original product breadth with a local-first data layer, interactive profiles, feed reactions, messaging, groups, admin metrics, theme switching, and polished demo flows.

Live site:
https://squarepad-demo-fix.web.app

## Automatic Firebase deploys from GitHub

This repo is wired for GitHub Actions + Firebase Hosting.

- Push to `main` or `master`: deploys the live site automatically
- Open a pull request: creates a Firebase Hosting preview deploy

### One-time GitHub setup

Add this repository secret in GitHub:

- `FIREBASE_SERVICE_ACCOUNT_SQUAREPAD_DEMO_FIX`

That secret should contain the full JSON for a Firebase/Google Cloud service account with access to deploy Hosting for project `squarepad-demo-fix`.

The workflow files are:

- `.github/workflows/firebase-hosting-live.yml`
- `.github/workflows/firebase-hosting-preview.yml`

Edit profile feature:
![Capture](https://github.com/asimdaud/squarepad_Social_Web_Application/assets/45770583/6c047627-a209-46fc-be02-096d248b0160)

Chat feature:
![ssCapture](https://github.com/asimdaud/squarepad_Social_Web_Application/assets/45770583/86998227-d8b2-4c38-92c3-bb9b1eee96f9)

Comment feature:
![image](https://github.com/asimdaud/squarepad_Social_Web_Application/assets/45770583/1f087dbf-36cf-4f14-b6da-ba70dbe46041)

