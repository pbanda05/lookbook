# Social Authentication Setup Guide

This guide will help you set up Google and Apple authentication for your Lookbook app.

## Prerequisites

1. Firebase project is already configured
2. Email/Password authentication is enabled in Firebase Console

## Step 1: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lookbook-bce46`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Toggle **Enable** to ON
6. Enter a **Project support email** (your email)
7. Click **Save**

## Step 2: Get Google OAuth Client ID

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on your **Web app** (or create one if you don't have it)
4. Copy the **OAuth client ID** (looks like: `897402009993-xxxxxxxxxxxxx.apps.googleusercontent.com`)

## Step 3: Add Google Client ID to Your App

Create a `.env` file in the root of your project:

```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_oauth_client_id_here
```

Or update `services/authService.js` directly with your client ID.

## Step 4: Enable Apple Sign-In in Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Apple**
3. Toggle **Enable** to ON
4. Click **Save**

## Step 5: Configure Apple Sign-In for iOS

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select your App ID
4. Enable **Sign In with Apple** capability
5. Configure your app's bundle identifier

## Step 6: Enable Anonymous Authentication (Optional)

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Anonymous**
3. Toggle **Enable** to ON
4. Click **Save**

## Step 7: Configure OAuth Redirect URIs

For Google OAuth to work properly, you need to add redirect URIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add these **Authorized redirect URIs**:
   - `https://auth.expo.io/@your-username/lookbook`
   - `lookbook://`
   - `exp://localhost:8081`

## Testing

1. **Google Sign-In**: Tap "Continue with Google" and complete the OAuth flow
2. **Apple Sign-In**: Tap "Continue with Apple" (iOS only) and complete the sign-in
3. **Email Sign-In**: Tap "Continue with Email" and enter your credentials
4. **Guest Mode**: Tap "Continue as guest" to try the app without an account

## Troubleshooting

### Google Sign-In Issues

- **"Redirect URI mismatch"**: Make sure you've added the correct redirect URIs in Google Cloud Console
- **"Invalid client ID"**: Verify your OAuth client ID is correct
- **"Network error"**: Check your internet connection and Firebase project status

### Apple Sign-In Issues

- **"Apple sign-in not available"**: Only works on iOS devices with iOS 13+
- **"Capability not enabled"**: Enable Sign In with Apple in Apple Developer Console
- **"Invalid bundle ID"**: Make sure your app's bundle ID matches your Apple Developer account

### General Issues

- **"Authentication method not enabled"**: Enable the method in Firebase Console → Authentication → Sign-in method
- **"Network request failed"**: Check your internet connection and Firebase project status

## Notes

- Google Sign-In works on all platforms (iOS, Android, Web)
- Apple Sign-In only works on iOS devices
- Guest mode allows users to try the app without creating an account
- All authentication methods integrate with Firebase Authentication

