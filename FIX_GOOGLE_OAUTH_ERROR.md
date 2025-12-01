# Fix Google OAuth "Access blocked: Authorization Error"

The error "doesn't comply with Google's OAuth 2.0 policy" with Error 400: invalid_request means your OAuth consent screen needs proper configuration. Even if your app shows "In production", it may not be fully configured.

## Quick Fix Steps:

### Step 1: Switch to Testing Mode (Recommended First Step)

Since you're getting access blocked errors, it's easier to start in Testing mode:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **lookbook-bce46**
3. Go to **APIs & Services** → **OAuth consent screen** (or use the left nav: **Google Auth Platform** → **Audience**)
4. If **Publishing status** shows "In production", click **"Back to testing"** button
5. This will switch your app to Testing mode where you can add test users

### Step 2: Configure OAuth Consent Screen

1. Still in **OAuth consent screen** (or **Google Auth Platform** → **Audience**)
2. Make sure **User type** is set to **External**
3. Click **"Edit App"** or go through the setup wizard
4. Fill in the required fields:
   - **App name**: Lookbook (or your app name)
   - **User support email**: bandaprateek0@gmail.com
   - **Developer contact email**: bandaprateek0@gmail.com
   - **App logo** (optional): Upload if you have one
5. Click **Save and Continue**
6. On **Scopes** page: Click **Save and Continue** (no need to add scopes for basic auth)
7. On **Test users** page:
   - Click **Add Users**
   - Add your email: **bandaprateek0@gmail.com**
   - Click **Add**
   - Click **Save and Continue**
8. On **Summary** page, review and click **Back to Dashboard**

### Step 3: Verify and Add Authorized Redirect URIs

1. In Google Cloud Console, go to **APIs & Services** → **Credentials** (or **Google Auth Platform** → **Clients**)
2. Find your OAuth 2.0 Client ID: `897402009993-sstpujcp2k0eie5ls6pdlgp9ia7jrpa2.apps.googleusercontent.com`
3. Click on it to edit
4. Check **Authorized redirect URIs** section
5. You should already have: `https://auth.expo.io/@pbanda05/lookbook`
6. **VERIFY** this URI matches exactly what your app is using:
   - Run your app and try to sign in
   - Check the console log - it will show: `Google OAuth redirect URI: https://auth.expo.io/@pbanda05/lookbook`
   - Make sure it matches EXACTLY (case-sensitive, no trailing slashes)
7. If the URI is different or missing, click **"+ Add URI"** and add:
   - The exact URI from your console log
   - Also add these for development:
     - `exp://localhost:8081`
     - `exp://localhost:19000`
     - `lookbook://` (your app scheme)
8. Click **Save** at the bottom
9. **Wait 2-5 minutes** for changes to propagate

### Step 4: Verify Configuration

**Where to go:**
1. In Google Cloud Console, in the **left sidebar**, click **"Audience"** (under "Google Auth Platform")
   - You can also go to: **APIs & Services** → **OAuth consent screen** (older interface)
   - Current URL should be: `console.cloud.google.com/auth/audience?project=lookbook-bce46`

**What to verify:**
2. On the **Audience** page, check:
   - **Publishing status**: Should show **"Testing"** (not "In production")
     - If it shows "In production", click the **"Back to testing"** button
   - **User type**: Should show **"External"**
   - **Test users**: Scroll down to find the **"Test users"** section
     - Verify your email **bandaprateek0@gmail.com** is in the list
     - If not, click **"Add Users"** or **"Edit App"** to add it

### Step 5: Clear Cache and Restart

1. **Stop your Expo server** (Ctrl+C or Cmd+C)
2. **Clear Expo cache**: Run `npx expo start -c` or `expo start --clear`
3. Try Google sign-in again
4. You should now see the Google sign-in page (not the error)

### Step 6: If Still Getting Error 400: invalid_request

This specific error usually means:
- **Redirect URI mismatch**: The URI in your code doesn't match Google Cloud Console
- **OAuth consent screen not configured**: Missing required fields
- **App not in correct mode**: Should be in Testing mode with test users

**Debug steps:**
1. Check the console log for the exact redirect URI being used
2. Compare it character-by-character with the URI in Google Cloud Console
3. Make sure there are no extra spaces, trailing slashes, or case differences
4. Verify OAuth consent screen has all required fields filled
5. Make sure you're signed in with an email that's in the Test users list
6. Wait 5-10 minutes after making changes (Google can be slow to propagate)

## Important Notes:

- **Test users only**: While in "Testing" mode, only emails in the test users list can sign in
- **Redirect URI must match exactly**: The URI in your code must exactly match one in Google Cloud Console
- **Wait a few minutes**: Changes in Google Cloud Console can take 1-2 minutes to propagate

## Common Issues and Solutions:

### Issue: Error 400: invalid_request
**Solution**: 
- Verify redirect URI matches exactly (case-sensitive)
- Make sure OAuth consent screen is fully configured
- Switch to Testing mode and add yourself as a test user

### Issue: "Access blocked" even after configuration
**Solution**:
- Make sure you're using an email that's in the Test users list
- Verify Publishing status is "Testing" (not "In production")
- Wait 5-10 minutes after configuration changes

### Issue: Redirect URI mismatch
**Solution**:
- Check console log for exact URI: `Google OAuth redirect URI: ...`
- Copy it exactly and add to Google Cloud Console
- No trailing slashes, exact case match

### Issue: Changes not taking effect
**Solution**:
- Wait 5-10 minutes (Google propagation delay)
- Clear Expo cache: `npx expo start -c`
- Clear browser cache if testing on web
- Restart your Expo server

## For Production:

When ready to publish:
1. Go to OAuth consent screen
2. Click **Publish App**
3. This allows anyone to sign in (not just test users)


