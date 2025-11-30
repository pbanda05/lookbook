# Complete Setup Guide: Google & Apple Sign-In

Follow these steps to enable social authentication in your Lookbook app.

## 🔴 Current Errors:
- **Google**: OAuth Client ID not configured
- **Apple**: Identity provider not enabled in Firebase

---

## Part 1: Enable Google Sign-In

### Step 1: Enable Google in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lookbook-bce46**
3. Click **Authentication** in the left sidebar
4. Click **Sign-in method** tab
5. Find **Google** in the list
6. Click on **Google**
7. Toggle **Enable** to **ON**
8. Enter your **Project support email** (your email address)
9. Click **Save**

### Step 2: Get Your Google OAuth Client ID

1. Still in Firebase Console, click the **gear icon (⚙️)** next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **Your apps** section
4. Find your **Web app** (it should show "Web" platform)
   - If you don't have a Web app, click **Add app** → **Web (</>)** → Register app → Copy the config
5. In the Web app section, look for **OAuth client ID**
   - It will look like: `897402009993-xxxxxxxxxxxxx.apps.googleusercontent.com`
6. **Copy this entire string** (including the numbers and `.apps.googleusercontent.com`)

### Step 3: Add Client ID to Your Project

**Option A: Using .env file (Recommended)**

1. In your project root (same folder as `package.json`), create a file named `.env`
2. Add this line (replace with your actual client ID):
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=897402009993-your-actual-id-here.apps.googleusercontent.com
   ```
3. Save the file

**Option B: Direct in code (Quick test)**

1. Open `services/authService.js`
2. Find line 18:
   ```javascript
   const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
   ```
3. Change it to:
   ```javascript
   const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '897402009993-YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   ```
4. Replace `YOUR_ACTUAL_CLIENT_ID` with the actual ID from Firebase

### Step 4: Restart Expo

1. Stop your Expo server (press `Ctrl+C` in terminal)
2. Run `npm start` or `expo start` again
3. Try Google sign-in

---

## Part 2: Enable Apple Sign-In

### Step 1: Enable Apple in Firebase Console

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Find **Apple** in the list
3. Click on **Apple**
4. Toggle **Enable** to **ON**
5. Click **Save**

**Note**: Apple Sign-In only works on iOS devices. It won't appear on Android or web.

### Step 2: Configure Apple Sign-In for iOS (If building for iOS)

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → Select your App ID
4. Enable **Sign In with Apple** capability
5. Save changes

**Note**: For Expo Go (development), Apple Sign-In should work without additional setup once enabled in Firebase.

---

## Part 3: Enable Guest/Anonymous Sign-In (Optional)

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Find **Anonymous** in the list
3. Click on **Anonymous**
4. Toggle **Enable** to **ON**
5. Click **Save**

---

## Verification Checklist

After setup, verify:

- [ ] Google Sign-In is enabled in Firebase Console
- [ ] Google OAuth Client ID is added to `.env` or `authService.js`
- [ ] Apple Sign-In is enabled in Firebase Console
- [ ] Anonymous Sign-In is enabled (if you want guest mode)
- [ ] Expo server has been restarted
- [ ] Try Google sign-in - should show Google login page (not 404)
- [ ] Try Apple sign-in on iOS - should show Apple login (not error)

---

## Troubleshooting

### Google Sign-In Still Shows 404

1. **Double-check the Client ID**: Make sure you copied the entire string including `.apps.googleusercontent.com`
2. **Check .env file**: Make sure it's in the root directory (same level as `package.json`)
3. **Restart Expo**: After adding `.env`, you MUST restart Expo server
4. **Check console**: Look for the actual client ID being used in logs

### Apple Sign-In Shows "operation-not-allowed"

1. **Verify in Firebase**: Go to Authentication → Sign-in method → Apple → Make sure it's enabled
2. **Check device**: Apple Sign-In only works on iOS devices (iPhone/iPad)
3. **Wait a few minutes**: Sometimes Firebase takes a minute to propagate changes

### Still Having Issues?

1. Check Firebase Console → Authentication → Users to see if accounts are being created
2. Check the Expo console for detailed error messages
3. Make sure your internet connection is stable
4. Try clearing Expo cache: `npx expo start -c`

---

## Quick Test

After setup:

1. **Google**: Tap "Continue with Google" → Should open Google login page
2. **Apple** (iOS only): Tap "Continue with Apple" → Should show Apple sign-in
3. **Email**: Tap "Continue with Email" → Enter email/password
4. **Guest**: Tap "Continue as guest" → Should sign in anonymously

---

## Need Help?

If you're stuck:
1. Check the error message in the Expo console
2. Verify each step above
3. Make sure all authentication methods are enabled in Firebase Console
4. Restart your Expo server after making changes

