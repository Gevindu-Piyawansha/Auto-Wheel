# Firebase Full‑Stack (Frontend + Functions + MongoDB Atlas)

This branch wires Firebase Hosting (Free) with Cloud Functions (Node 18) and MongoDB Atlas (M0 Free) to run the app end‑to‑end without paid infrastructure.

## Overview
- Frontend: React build served by Firebase Hosting
- Backend: Express app deployed as a single HTTPS Function `api` under `/api/*`
- Database: MongoDB Atlas M0 (free tier)

## Setup
1) Create MongoDB Atlas cluster (M0)
   - Create DB user and get connection string `mongodb+srv://...`
   - Choose a DB name (e.g., `auto-wheel`)

2) Configure Firebase project
   - Update `.firebaserc` with your project id
   - Install Firebase CLI:
     - `npm install -g firebase-tools`
     - `firebase login`
     - `firebase use --add` (select your project)

3) Set secrets/env for Functions
   - Preferred: Firebase Functions secrets (requires CLI v12+):
     - `firebase functions:secrets:set MONGODB_URI`
     - `firebase functions:secrets:set MONGO_DB_NAME` (optional, defaults to `auto-wheel`)

4) Build and deploy
   - Frontend build:
     - `cd frontend`
     - Set `REACT_APP_API_BASE_URL=/api` so the app calls the function via Hosting rewrite
     - `npm ci && npm run build`
   - Functions build+deploy and Hosting deploy:
     - From repo root: `cd functions && npm ci && npm run build && cd ..`
     - `firebase deploy --only functions,hosting`

## Routing
- `firebase.json` rewrites `/api/**` to the `api` function and `**` to `index.html` (SPA)

## Notes
- CORS: Enabled to accept Hosting origin; adjust as needed.
- Admin endpoints: Basic `/api/inquiries` GET exists. Add auth (Firebase Auth / tokens) before production admin usage.
- Cold starts: Functions are generally fast; first request may be slower on free.
- If you prefer Cloud Run with .NET, keep this Hosting rewrite pattern but switch `rewrites` to a Cloud Run target.
