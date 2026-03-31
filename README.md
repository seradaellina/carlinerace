# Marketing Competition Monitoring System

The system allows to:

- Add Android apps by Google Play URL.
- Keep a tracked apps list (pause/resume monitoring).
- Capture Google Play listing screenshots manually and on a schedule.
- View screenshots in a timeline (newest first) per app.

## Architecture

- `backend` - Express API, SQLite storage, scheduler, Playwright screenshot capture.
- `frontend` - React app with two screens:
  - app management
  - app monitoring timeline

## Tech stack

- Backend: Node.js, Express, TypeScript, better-sqlite3, node-cron, Playwright
- Frontend: React, TypeScript, Vite, React Router

## API endpoints

- `GET /api/apps`
- `POST /api/apps`
- `PUT /api/apps/:id`
- `GET /api/apps/:id/screenshots`
- `POST /api/apps/:id/capture`
- Static screenshots: `GET /screenshots/<file>.png`

## Local run

### 1) Install dependencies

At repository root:

```bash
npm install
```

### 2) Install Playwright browser

```bash
npx playwright install chromium
```

### 3) Configure environment

```bash
cp backend/.env backend/.env
```

Optional:

- `PORT` - backend API port (default `4000`)
- `CAPTURE_CRON` - cron expression for periodic capture (default every 30 minutes)

### 4) Start development mode

From root:

```bash
npm run dev
```

Then open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Production build

```bash
npm run build
npm run start
```
