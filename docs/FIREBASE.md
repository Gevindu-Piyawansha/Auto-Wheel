# Firebase Hosting for Frontend (React)

This repo is configured to deploy the React frontend to Firebase Hosting with zero backend changes.

## Why this setup
- Keep the .NET API and SQL database as-is (no rewrite to Firestore)
- Use Firebase Hosting Free plan for fast, reliable static hosting
- Keep API at your existing host (Azure App Service F1 or similar)

## Prereqs
- Firebase project (create at https://console.firebase.google.com)
- Install Firebase CLI locally

```powershell
npm install -g firebase-tools
firebase login
firebase use --add  # select your project
```

Update `.firebaserc` with your project id:
```json
{
  "projects": { "default": "your-firebase-project-id" }
}
```

## Build and deploy locally
1) Configure your API base URL in build env:
   - Set `REACT_APP_API_BASE_URL` to your API (e.g., `https://auto-wheel-api.azurewebsites.net`)
2) Build the frontend
```powershell
cd frontend
$env:REACT_APP_API_BASE_URL="https://auto-wheel-api.azurewebsites.net"
npm ci
npm run build
```
3) Deploy
```powershell
cd ..
firebase deploy --only hosting
```

## GitHub CI (optional)
You can connect the repo via the Firebase Hosting GitHub action (no custom token needed):
- In Firebase console → Hosting → Connect GitHub repo and follow prompts.
- It will create a workflow in your repo via a GitHub App and deploy on pushes to main.

If you prefer manual workflow, create `.github/workflows/firebase-hosting.yml`:
```yaml
name: Deploy Frontend to Firebase Hosting
on:
  push:
    branches: [ main ]
    paths: [ 'frontend/**' ]
  workflow_dispatch:
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci || npm install
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
        env:
          REACT_APP_API_BASE_URL: ${{ secrets.REACT_APP_API_BASE_URL }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-firebase-project-id
```
Secrets needed:
- `REACT_APP_API_BASE_URL`
- `FIREBASE_SERVICE_ACCOUNT` (JSON) — if not using the GitHub App integration

## SPA routing
`firebase.json` has a catch‑all rewrite to `index.html` so React Router routes work on refresh.
