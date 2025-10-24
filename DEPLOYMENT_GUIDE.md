# Step-by-Step Deployment Guide: Auto-Wheel Full-Stack

This guide walks you through deploying your React frontend and Node.js API backend to Firebase, with MongoDB Atlas as the database—all on free tiers.

## Prerequisites Checklist
- [ ] Google account
- [ ] Node.js installed (you have v22, which is fine)
- [ ] Git installed and authenticated
- [ ] MongoDB Atlas account (free)

---

## Phase 1: Database Setup (MongoDB Atlas - Free M0)

### Step 1.1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose the **FREE** tier when prompted

### Step 1.2: Create a Free Cluster
1. After login, click **"Build a Database"**
2. Choose **M0 (Free Forever)** tier
3. Select a cloud provider and region (closest to your users)
4. Name your cluster: `auto-wheel-cluster`
5. Click **"Create"**
6. Wait 1-3 minutes for cluster to provision

### Step 1.3: Configure Database Access
1. In Atlas dashboard, click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `autowheel-admin` (or your choice)
5. Click **"Autogenerate Secure Password"** and **COPY IT**
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

### Step 1.4: Configure Network Access
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict this to your Firebase Functions IP ranges
4. Click **"Confirm"**

### Step 1.5: Get Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like `mongodb+srv://autowheel-admin:<password>@...`)
5. **IMPORTANT**: Replace `<password>` with the password you copied earlier
6. Save this connection string securely—you'll need it soon

**Example connection string:**
```
mongodb+srv://autowheel-admin:YourSecurePassword123@auto-wheel-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Phase 2: Firebase Project Setup

### Step 2.1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Project name: `auto-wheel` (or your choice)
4. Click **"Continue"**
5. **Disable** Google Analytics (not needed for now)
6. Click **"Create project"**
7. Wait for project creation, then click **"Continue"**

### Step 2.2: Note Your Project ID
1. In Firebase console, click the **gear icon** ⚙️ (Project settings)
2. Under "General" tab, copy your **Project ID** (e.g., `auto-wheel-abc123`)
3. Keep this handy

---

## Phase 3: Install and Configure Firebase CLI

### Step 3.1: Install Firebase CLI
Open PowerShell and run:
```powershell
npm install -g firebase-tools
```

### Step 3.2: Login to Firebase
```powershell
firebase login
```
- A browser window will open
- Sign in with the same Google account you used for Firebase
- Grant permissions
- Return to terminal

### Step 3.3: Link Your Project
Navigate to your project directory:
```powershell
cd C:\Users\Admin\Gevindu\Software\Dinesh\Auto-Wheel
```

Update `.firebaserc` with your project ID:
```powershell
notepad .firebaserc
```

Change:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

To (use YOUR project ID from Step 2.2):
```json
{
  "projects": {
    "default": "auto-wheel-abc123"
  }
}
```

Save and close.

Verify the connection:
```powershell
firebase use default
```

You should see: `Now using alias default (auto-wheel-abc123)`

---

## Phase 4: Configure Secrets (MongoDB Connection)

### Step 4.1: Set MongoDB URI Secret
Run this command (it will prompt you to paste the connection string):
```powershell
firebase functions:secrets:set MONGODB_URI
```

When prompted, paste your MongoDB connection string from **Step 1.5**, then press **Enter**.

Example:
```
? Enter a value for MONGODB_URI: mongodb+srv://autowheel-admin:YourPassword@auto-wheel-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 4.2: Set Database Name (Optional)
```powershell
firebase functions:secrets:set MONGO_DB_NAME
```

Enter: `auto-wheel`

---

## Phase 5: Build Frontend

### Step 5.1: Set API Base URL
The frontend needs to know where the API is. Since we're using Firebase Hosting rewrites, the API will be at `/api`.

Create a production environment file:
```powershell
cd frontend
notepad .env.production
```

Add this line:
```
REACT_APP_API_BASE_URL=/api
```

Save and close.

### Step 5.2: Install Frontend Dependencies
```powershell
npm ci
```

### Step 5.3: Build Frontend
```powershell
npm run build
```

You should see:
```
Compiled successfully.
File sizes after gzip:
  ...
The build folder is ready to be deployed.
```

### Step 5.4: Return to Root
```powershell
cd ..
```

---

## Phase 6: Build Backend Functions

### Step 6.1: Install Functions Dependencies
```powershell
cd functions
npm ci
```

### Step 6.2: Build Functions
```powershell
npm run build
```

Should complete with no errors.

### Step 6.3: Return to Root
```powershell
cd ..
```

---

## Phase 7: Deploy Everything! 🚀

### Step 7.1: Deploy Hosting and Functions
From the project root:
```powershell
firebase deploy --only functions,hosting
```

**What happens:**
1. Functions are uploaded and deployed (takes 2-5 minutes)
2. Frontend build is uploaded to Firebase Hosting
3. You'll see progress bars and status messages

### Step 7.2: Note Your URLs
When deployment completes, you'll see:

```
✔  Deploy complete!

Hosting URL: https://auto-wheel-abc123.web.app
Function URL: https://us-central1-auto-wheel-abc123.cloudfunctions.net/api
```

**Copy your Hosting URL!** This is your live website.

---

## Phase 8: Seed Database with Sample Cars

Your database is empty. Let's add some sample cars.

### Step 8.1: Use MongoDB Compass (Easiest)
1. Download and install **MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. Open Compass
3. Paste your connection string from **Step 1.5**
4. Click **"Connect"**
5. Create database: `auto-wheel`
6. Create collection: `Cars`
7. Click **"Add Data"** → **"Insert Document"**
8. Paste sample car JSON (see below)
9. Click **"Insert"**

**Sample Car Document:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "price": 28500,
  "mileage": 5000,
  "engineCC": "2500",
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "vehicleGrade": "Premium",
  "category": "Sedan",
  "imageUrl": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
  "location": "Oslo",
  "description": "Well maintained, single owner"
}
```

Repeat to add 3-5 more cars with different models.

### Step 8.2: Alternative - Use API to Add Cars
You can also POST to your API:
```powershell
$body = @{
    make = "Honda"
    model = "Civic"
    year = 2022
    price = 24000
    mileage = 12000
    engineCC = "1800"
    fuelType = "Petrol"
    transmission = "Manual"
    vehicleGrade = "Standard"
    category = "Sedan"
    imageUrl = "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
    location = "Bergen"
    description = "Great condition"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://auto-wheel-abc123.web.app/api/cars" -Method POST -Body $body -ContentType "application/json"
```

---

## Phase 9: Test Your Live Site! 🎉

### Step 9.1: Open Your Site
Open your Hosting URL in a browser:
```
https://auto-wheel-abc123.web.app
```

### Step 9.2: Verify Features
- [ ] Home page loads
- [ ] Car listings appear
- [ ] Search/filter works
- [ ] Click on a car to see details
- [ ] Submit an inquiry form
- [ ] Check Admin dashboard (if you have sample data)

### Step 9.3: Check Browser Console
Press **F12** and check the Console tab:
- ✅ No CORS errors
- ✅ API calls to `/api/*` succeed
- ✅ Network tab shows successful requests

---

## Phase 10: Set Up Auto-Deploy (Optional but Recommended)

### Step 10.1: Connect GitHub
1. In Firebase console, go to **Hosting**
2. Click **"Get started"** or **"Add another site"**
3. Choose **"GitHub"**
4. Authorize Firebase to access your repository
5. Select repository: `Gevindu-Piyawansha/Auto-Wheel`
6. Select branch: `main`
7. Configure build settings:
   - **Frontend build directory**: `frontend/build`
   - **Functions directory**: `functions`
   - **Build command**: Leave default or customize
8. Click **"Save & Deploy"**

Now every push to `main` will auto-deploy!

---

## Troubleshooting Common Issues

### Issue 1: "MONGODB_URI is not set"
**Solution:**
```powershell
firebase functions:secrets:set MONGODB_URI
```
Paste your connection string again, then redeploy:
```powershell
firebase deploy --only functions
```

### Issue 2: "Failed to fetch cars" / Empty list
**Check:**
1. MongoDB Atlas cluster is running (green dot in Atlas dashboard)
2. Database name is correct: `auto-wheel`
3. Collection name is correct: `Cars` (case-sensitive)
4. You added sample car documents

### Issue 3: CORS errors in browser
**Solution:** Already configured in functions/src/index.ts with `cors({ origin: true })`

If still happening, check that requests go to `/api/*` (not directly to Cloud Functions URL)

### Issue 4: Functions deployment fails
**Check:**
1. You're in the project root directory
2. `functions/lib/index.js` exists (run `npm run build` in functions/)
3. Firebase CLI is updated: `npm install -g firebase-tools@latest`

### Issue 5: Frontend shows old version
**Solution:** Clear cache or open in incognito mode. Firebase Hosting caches aggressively.

---

## Cost Overview (All Free Tiers)

### MongoDB Atlas M0 (Free Forever)
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ No credit card required

### Firebase Hosting (Free Tier)
- ✅ 10 GB storage
- ✅ 360 MB/day data transfer
- ✅ Custom domain SSL included

### Firebase Functions (Free Tier)
- ✅ 2M invocations/month
- ✅ 400K GB-seconds/month
- ✅ 200K CPU-seconds/month
- ✅ 5GB outbound data/month

**Total Monthly Cost: $0** for moderate traffic demo/portfolio use.

---

## Next Steps After Deployment

### Security Enhancements (Before Going Public)
1. **Add Authentication:**
   - Enable Firebase Authentication
   - Protect admin routes with auth checks
   
2. **Secure MongoDB Access:**
   - Restrict Atlas network access to Firebase Functions IPs only
   - Use environment-specific DB users

3. **Add API Rate Limiting:**
   - Implement rate limiting in functions to prevent abuse

4. **Input Validation:**
   - Add stricter validation in API endpoints

### Feature Enhancements
1. Add car images upload (Firebase Storage)
2. Admin login with Firebase Auth
3. Email notifications for inquiries (SendGrid/Firebase Extensions)
4. Car search with MongoDB text indexes
5. Image optimization and CDN

---

## Quick Reference Commands

### Redeploy after code changes:
```powershell
# Frontend only
cd frontend
npm run build
cd ..
firebase deploy --only hosting

# Functions only
cd functions
npm run build
cd ..
firebase deploy --only functions

# Both
npm run build --prefix frontend
npm run build --prefix functions
firebase deploy --only functions,hosting
```

### View logs:
```powershell
firebase functions:log
```

### Test locally (emulators):
```powershell
firebase emulators:start
```

### Check deployment status:
```powershell
firebase deploy:list
```

---

## Support and Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas
- **Firebase Console**: https://console.firebase.google.com
- **MongoDB Atlas Console**: https://cloud.mongodb.com

---

## Summary Checklist

- [ ] MongoDB Atlas cluster created (M0 free tier)
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Firebase project created
- [ ] Firebase CLI installed and logged in
- [ ] `.firebaserc` updated with project ID
- [ ] `MONGODB_URI` secret set in Firebase
- [ ] Frontend built with `REACT_APP_API_BASE_URL=/api`
- [ ] Functions built (TypeScript compiled)
- [ ] Deployed with `firebase deploy --only functions,hosting`
- [ ] Sample cars added to MongoDB
- [ ] Live site tested and working
- [ ] (Optional) GitHub auto-deploy configured

**🎉 Congratulations! Your full-stack car sale platform is live!**

Your site is now accessible worldwide at:
**https://[your-project-id].web.app**

Share the link on your portfolio, LinkedIn, and resume to showcase your full-stack development skills to Norwegian employers!
