# Revenue Intelligence Inbox — Full-Stack App

A production-quality B2B SaaS workspace built with **React + Vite + Express + MongoDB**.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Lucide React, React Router |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Extras | JSZip (exports), Axios, multer |

---

## Project Structure

```
assignment1/
├── frontend/          ← React + Vite app (port 5173)
├── backend/           ← Express API (port 3001)
├── data/              ← Source batch JSON files (01_initial, 02_update)
├── exports/           ← Pre-generated export files
├── app/               ← Original standalone HTML app (reference)
└── README.md          ← Original assignment README
```

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) on port 27017

### 2. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI if needed
npm install
npm run dev               # runs on http://localhost:3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

### 4. Import Data
- Open the app at **http://localhost:5173**
- Click **Import** in the top bar
- Click **Load Initial Batch (01)** → 44 records loaded
- Click **Load Update Batch (02)** → M07 upgraded to rev 2

---

## Replay Contract

| Step | Action | Expected |
|---|---|---|
| 1 | Load Initial Batch (01) | 44 records, 17 usable transcripts |
| 2 | Load Initial Batch (01) again | 0 added, 44 ignored — no duplicates |
| 3 | Edit route on M07 → "Customer Follow-up" | ★ Manual Override badge shown |
| 4 | Load Update Batch (02) | M07 rev 1→2, transcript appears, route preserved |
| 5 | Restart server / refresh page | All state persists from MongoDB |

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
| GET | `/api/exports/manifest` | Manifest JSON array |
| GET | `/api/exports/manifest.json` | Download manifest.json |
| GET | `/api/exports/manifest.csv` | Download manifest.csv |
| GET | `/api/exports/zip` | Download full ZIP archive |

---

## Environment Variables

**backend/.env.example**
```
MONGO_URI=mongodb://localhost:27017/revenue_intel
PORT=3001
NODE_ENV=development
```
