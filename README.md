# Advanced Online Quiz Platform (Demo)

Day 1 deliverable: project setup + MongoDB schema + authentication (email/password, with optional Google/GitHub OAuth).

## Quick start (local)

### 1) Backend

1. Copy `backend/.env.example` to `backend/.env` and fill values.
2. Start MongoDB (Docker optional):
   - `docker compose up -d mongodb`
3. Install and run:
   - `cd backend`
   - `npm install`
   - `npm run dev`

Backend runs on `http://localhost:4000`.

### 2) Frontend

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Install and run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

Frontend runs on `http://localhost:3000`.

## API (Auth)

- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me` (requires auth cookie)

OAuth (optional; enabled only if env vars are set):
- `GET /api/auth/google` → redirects
- `GET /api/auth/github` → redirects

