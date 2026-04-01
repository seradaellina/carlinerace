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

Optional:

- `PORT` - backend API port (default `4000`)
- `CAPTURE_CRON` - cron expression for periodic capture (default every 30 minutes)

### 3) Start development mode

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

## Deployment

The app was deployed to AWS and is currently available at:

- [http://carlinerace-frontend-serada-2026.s3-website.eu-north-1.amazonaws.com/](http://carlinerace-frontend-serada-2026.s3-website.eu-north-1.amazonaws.com/)

### How it is deployed in AWS

- Frontend is hosted in an S3 bucket with static website hosting enabled.
- Backend is hosted on an EC2 instance (Amazon Linux) and serves the API on port `4000`.
- Backend process is managed by PM2 for auto-restart and persistence across reboots.
- Screenshot capture runs with Playwright on the EC2 instance.

### Deployment flow used

1. Build frontend with backend URL:
   - `VITE_API_URL=http://13.62.100.140:4000 npm run build -w frontend`
2. Upload frontend build to S3:
   - `aws s3 sync frontend/dist s3://carlinerace-frontend-serada-2026 --delete`
3. Run backend on EC2 with PM2:
   - `pm2 start npm --name carlinerace-backend -- run start -w backend`
   - `pm2 save`
