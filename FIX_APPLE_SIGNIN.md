# Fix Apple Sign-In Error

The error "The identity provider configuration is not found" means Apple Sign-In is not enabled in Firebase.

## Quick Fix (2 minutes):

### Step 1: Enable Apple Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lookbook-bce46**
3. Click **Authentication** in the left sidebar
4. Click the **Sign-in method** tab
5. Scroll down and find **Apple** in the list
6. Click on **Apple**
7. Toggle the **Enable** switch to **ON** (green)
8. Click **Save**

That's it! Apple Sign-In should now work.

## Verify It's Enabled:

After enabling, you should see:
- ✅ Apple shows as "Enabled" in the Sign-in method list
- ✅ The toggle is green/ON

## Test Apple Sign-In:

1. Restart your Expo app (if it's running)
2. Go to the Sign In or Sign Up screen
3. Tap "Continue with Apple"
4. You should see the Apple Sign-In prompt (not an error)

## Important Notes:

- **Apple Sign-In only works on iOS devices** (iPhone/iPad)
- It won't appear or work on Android devices
- It won't work in web browsers
- You need to test on a real iOS device or iOS Simulator

## Still Getting the Error?

If you still see the error after enabling:

1. **Wait 1-2 minutes** - Firebase sometimes takes a moment to propagate changes
2. **Refresh Firebase Console** - Make sure Apple shows as "Enabled"
3. **Restart Expo** - Stop and restart your Expo server
4. **Check device** - Make sure you're testing on an iOS device (not Android)
5. **Check iOS version** - Apple Sign-In requires iOS 13+

## Troubleshooting:

### "Apple sign-in not available"
- You're not on an iOS device
- Your iOS version is below 13.0
- The app is running on Android or web

### "operation-not-allowed" error
- Apple Sign-In is not enabled in Firebase Console
- You haven't saved the changes in Firebase
- Wait a few minutes and try again

