# Cloudinary Free Setup Guide

## Quick Start (2 minutes)

### Step 1: Create Free Account
1. Visit: https://cloudinary.com/users/register_free
2. Sign up with your email (NO credit card required)
3. Verify your email

### Step 2: Get Your Credentials
After login, you'll see the Dashboard:

1. **Cloud Name**: Find it at the top (example: `dxxxxxxxxxxxxx`)
2. Copy this value

### Step 3: Create Upload Preset
1. Click **Settings** (gear icon) → **Upload**
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Configure:
   - **Signing Mode**: Select **Unsigned**
   - **Folder**: Enter `auto-wheel/cars`
   - **Use filename**: Enable (optional)
   - **Unique filename**: Enable (recommended)
5. Click **Save**
6. Copy the **preset name** (example: `auto_wheel_upload`)

### Step 4: Update Your Project

Edit `frontend/.env.local`:
```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
REACT_APP_API_BASE_URL=https://auto-wheel-api.onrender.com
```

### Step 5: Build & Deploy
```powershell
cd frontend
$env:REACT_APP_API_BASE_URL='https://auto-wheel-api.onrender.com'
$env:REACT_APP_CLOUDINARY_CLOUD_NAME='your_cloud_name'
$env:REACT_APP_CLOUDINARY_UPLOAD_PRESET='your_preset_name'
npm run build

cd ..
firebase deploy --only hosting
```

## Free Tier Benefits
✅ **25 GB** storage  
✅ **25 GB** bandwidth per month  
✅ **Unlimited** transformations  
✅ **No** credit card required  
✅ **Auto** image optimization  
✅ **CDN** delivery worldwide  

## Troubleshooting

### "Upload preset not found"
- Make sure the preset is **Unsigned** (not Signed)
- Double-check the preset name (case-sensitive)

### "Invalid cloud name"
- Cloud name should be from your dashboard (usually starts with 'd')
- No spaces or special characters

### Upload button does nothing
- Check browser console for errors
- Clear cache and hard reload (Ctrl+Shift+R)

## Current Status
- ✅ Code implemented with Cloudinary widget
- ✅ Frontend deployed to Firebase
- ⏳ Waiting for your Cloudinary credentials
- 🎯 Using 'demo' account (has restrictions)

## Support
If you need help: https://support.cloudinary.com
