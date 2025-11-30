# Quick Fix: Google OAuth 404 Error

The 404 error occurs because the Google OAuth Client ID is not configured.

## Quick Fix Steps:

### 1. Get Your Google OAuth Client ID

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lookbook-bce46**
3. Click the **gear icon** (⚙️) → **Project Settings**
4. Scroll down to **Your apps** section
5. Find your **Web app** (or create one if you don't have it)
6. Look for **OAuth client ID** - it should look like:
   ```
   897402009993-xxxxxxxxxxxxx.apps.googleusercontent.com
   ```
7. **Copy this entire string**

### 2. Add to Your Project

**Option A: Create .env file (Recommended)**

1. Create a file named `.env` in the root of your project (same level as `package.json`)
2. Add this line:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=897402009993-your-actual-client-id-here.apps.googleusercontent.com
   ```
3. Replace `your-actual-client-id-here` with the actual ID from Firebase

**Option B: Update directly in code (Quick test)**

1. Open `services/authService.js`
2. Find line 18:
   ```javascript
   const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
   ```
3. Change it to:
   ```javascript
   const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '897402009993-YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   ```
4. Replace `YOUR_ACTUAL_CLIENT_ID` with your actual client ID

### 3. Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable** to ON
4. Enter a **Project support email**
5. Click **Save**

### 4. Restart Your Expo Server

After adding the client ID:
1. Stop your Expo server (Ctrl+C)
2. Run `npm start` or `expo start` again
3. Try Google sign-in again

## Verify It's Working

After configuration, when you tap "Continue with Google", you should see:
- Google sign-in page (not a 404 error)
- Ability to select your Google account
- Successful authentication

## Still Getting 404?

If you still get a 404 error:
1. Double-check the client ID is correct (no extra spaces, complete string)
2. Make sure Google Sign-In is enabled in Firebase Console
3. Try clearing your Expo cache: `npx expo start -c`
4. Check the console logs for more detailed error messages

