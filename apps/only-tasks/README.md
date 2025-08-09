# Simple Task Tracker

A minimal Next.js (App Router) + TypeScript + Tailwind CSS project.

## Requirements
- Node 18+

## Setup
1. Install dependencies:
   - npm install
2. Run dev server:
   - npm run dev
3. Type check:
   - npm run typecheck
4. Lint:
   - npm run lint

Open http://localhost:3000

## Environment Variables
Create a `.env.local` (not committed). Example:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment (Vercel)
- Push to GitHub and import the repo in Vercel
- Framework preset: Next.js
- Env vars: set NEXT_PUBLIC_APP_URL

## Project structure
- app/ — App Router routes, metadata, error/loading pages
- components/ — UI components
- public/ — static assets (icons, robots.txt)
- tailwind.config.ts — Tailwind setup (dark mode via class)

## CI
- GitHub Actions workflow runs typecheck, lint, and build on pushes/PRs to main.

## Notes
- Strict TypeScript enabled
- SEO: metadata, sitemap, robots
- PWA manifest added (replace icons in public/)

## Use this as a Template
1. Push this repo to GitHub.
2. In GitHub, go to Settings → General → Template repository → check "Template repository" and Save.
3. Click the green "Use this template" button to generate new projects from it.

Alternatively with GitHub CLI: gh repo edit --template true
