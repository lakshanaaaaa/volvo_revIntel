# Revenue Intelligence Inbox — Full-Stack App

A production-quality B2B SaaS workspace for sales managers to review call and meeting activity, route conversations, and generate organized exports.

Built with **React + Vite + Express + MongoDB**.

---

## Quick Start (3 commands)

```bash
# 1. Install all dependencies (root + backend + frontend)
npm run install:all

# 2. Start both servers with one command
npm run dev

# 3. Open the app
#    Frontend: http://localhost:5173
#    Backend:  http://localhost:3001
```

That's it. Both servers run in a single terminal with colored output.

---

## Prerequisites

- **Node.js** 18+ (v22 recommended)
- **MongoDB** running locally on port 27017
  - Windows: Install MongoDB Community Edition, it runs as a service
  - Or use MongoDB Atlas (cloud) — update `backend/.env` with your Atlas URI

---

## Single Commands

| Command | What it does |
|---|---|
| `npm run install:all` | Installs root, backend, and frontend dependencies |
| `npm run dev` | Starts both backend + frontend concurrently |
| `npm run dev:backend` | Starts only the Express API server |
| `npm run dev:frontend` | Starts only the Vite dev server |
| `npm run build` | Builds the frontend for production |
| `npm start` | Alias for `npm run dev` |

---

## Project Structure

```
assignment1/
├── package.json              ← Root: single-command scripts
├── scripts/
│   ├── install-all.js        ← One-command dependency installer
│   └── dev.js                ← Concurrent dev launcher (backend + frontend)
├── frontend/                 ← React + Vite app (port 5173)
│   ├── src/
│   │   ├── App.jsx            ← Root router (Sidebar + Topbar layout)
│   │   ├── pages/             ← 7 pages (Overview, Brief, Conversations, etc.)
│   │   ├── components/        ← UI components, layout, modals
│   │   ├── lib/               ← API client + utilities
│   │   └── data/              ← Batch JSON for quick-load import
│   └── package.json
├── backend/                  ← Express + MongoDB API (port 3001)
│   ├── src/
│   │   ├── server.js         ← Express app entry
│   │   ├── models/            ← Mongoose schemas (ConversationRecord, ImportLog)
│   │   ├── routes/            ← REST API (records, imports, exports)
│   │   ├── services/          ← Business logic (import engine, export ZIP generator)
│   │   └── data/              ← Pre-generated analysis data
│   └── package.json
├── data/                     ← Source batch JSON files
├── exports/                  ← Pre-generated export files
└── app/                       ← Original standalone HTML app (reference)
```

---

## What to Test (Replay Contract)

Once both servers are running and the app is open at http://localhost:5173:

### 1. Import Data
- Click **Import** in the top bar
- Click **Load Initial Batch (01)**
- Verify: 44 records loaded, toast shows "44 added, 0 updated, 0 ignored"
- Overview page shows KPIs, charts, and record table

### 2. Duplicate Prevention
- Click **Import** again → **Load Initial Batch (01)** again
- Verify: "0 added, 0 updated, 44 ignored" — no duplicates, no inflated counts

### 3. Manual Route Override
- Go to **Conversations** → click any record (e.g. M07)
- Click **Edit Route** → check "Customer Follow-up" → **Save Correction**
- Verify: ★ Manual Override badge appears
- Go to **Routing & Review** — the record shows the manual badge

### 4. Late Update (Revision 2)
- Click **Import** → **Load Update Batch (02)**
- Verify: "0 added, 1 updated, 43 ignored" — M07 upgraded to rev 2
- M07 now has a 27-turn transcript visible
- M07's manual route (Customer Follow-up) is preserved

### 5. Persistence
- Refresh the page (F5)
- All data, manual overrides, and routes persist from MongoDB

### 6. Exports
- Go to **Exports** page
- Click **Download JSON** → manifest.json downloads
- Click **Download CSV** → manifest.csv downloads
- Click **Download ZIP** → full archive with all analysis .md files

### 7. Other Pages
- **Manager Brief** — daily brief with priorities, coaching, timeline
- **Routing & Review** — grouped by route, edit any record's route
- **Data Imports** — replay contract steps and import history
- **Data Definitions** — field glossary, metric definitions, routing taxonomy

---

## API Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/health` | DB connection status |
| GET | `/api/records` | All records (filterable) |
| GET | `/api/records/stats` | Dashboard statistics |
| GET | `/api/records/:id` | Single record detail |
| PATCH | `/api/records/:id/route` | Update route (manual override) |
| PATCH | `/api/records/:id/route/clear` | Revert to auto route |
| POST | `/api/import/batch` | Import batch JSON |
| GET | `/api/import/log` | Import history |
| GET | `/api/exports/manifest` | Manifest JSON array |
| GET | `/api/exports/manifest.json` | Download manifest.json |
| GET | `/api/exports/manifest.csv` | Download manifest.csv |
| GET | `/api/exports/zip` | Download full ZIP archive |

---

## Environment Variables

**backend/.env** (copy from `.env.example`):
```
MONGO_URI=mongodb://localhost:27017/revenue_intel
PORT=3001
NODE_ENV=development
```

**frontend/.env** (optional — Vite proxies /api to backend automatically):
```
VITE_API_URL=http://localhost:3001
```
