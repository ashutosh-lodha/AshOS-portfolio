# ashutoshdev.online

Portfolio of Ashutosh Lodha, built as **AshOS**: a small desktop OS in the browser with draggable windows, a working terminal, a live system monitor and one app per project.

```bash
npm install
npm run dev          # AshOS on http://localhost:5173
npm run dev:brutal   # alternate "Brutal" design on :5179 (not deployed)
```

## Content

Everything on the page comes from [`src/shared/content.js`](src/shared/content.js) (profile, experience, projects) and
[`src/shared/stats.json`](src/shared/stats.json) (LeetCode / GitHub numbers, refreshed by `npm run stats` on every deploy).
Screenshots live in `public/work/`.

## Deploy

Hosted on Vercel (Hobby plan). Every push to `main` builds and deploys automatically; `vercel.json` runs
`npm run stats && npm run build` and serves `dist/`. The domain `ashutoshdev.online` is attached to the Vercel project,
with DNS at Hostinger: an apex `A` record to Vercel and `www` as a `CNAME` to Vercel.
