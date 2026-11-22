# AshOS — portfolio

**Live at [ashutoshdev.online](https://ashutoshdev.online)**

[![AshOS — the portfolio of Ashutosh Lodha](docs/ashos.png)](https://ashutoshdev.online)

My portfolio, built as a small desktop OS in the browser: draggable windows, a working terminal (`help`, `projects`, `neofetch`, `sudo hire-me` …), a live system monitor that pings my deployed projects, and one app per project. On phones it turns into a home-screen grid.

## Projects

| Project | What it is | Links |
| --- | --- | --- |
| **ArchBoard** | The board built for system design interviews | [Live](https://archboard.ashutoshdev.online) · [Source](https://github.com/ashutosh-lodha/ArchBoard) |
| **UptimeHQ** | Uptime monitoring, incidents and alerts for sites and APIs | [Live](https://uptimehq.ashutoshdev.online) · [Source](https://github.com/ashutosh-lodha/UptimeHQ) |
| **DataDrop** | Privacy-first, pay-per-GB cloud storage | [Live](https://datadrop.co.in) · [Source](https://github.com/ashutosh-lodha/datadrop-storage) |
| **Mini IDP** | Internal developer platform for Kubernetes | [Source](https://github.com/ashutosh-lodha/idp-platform) |
| **Rate Gate** | Distributed API gateway with rate limiting | [Source](https://github.com/ashutosh-lodha/api-gateway-rate-limiter) |

## Run locally

```bash
npm install
npm run dev     # http://localhost:5173
```

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Page shell |
| `os/main.js`, `os/style.css` | The OS: window manager, terminal, monitor, apps |
| `src/shared/content.js` | Profile, experience and projects — edit this to change the content |
| `src/shared/stats.json` | LeetCode / GitHub numbers, refreshed by `npm run stats` on every deploy |
| `scripts/fetch-stats.mjs` | Fetches those numbers |
| `public/` | Favicon and project screenshots |

## Deploy

Hosted on Vercel and connected to this repo: every push to `main` builds (`npm run stats && npm run build`, see `vercel.json`) and goes live on [ashutoshdev.online](https://ashutoshdev.online). Other branches and pull requests get preview URLs.
