# Firebase Authentication Setup

If account creation isn't working, you need to enable Email/Password authentication in your Firebase console.

## Steps to Enable Email/Password Authentication:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `lookbook-bce46`

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - If you don't see it, click "Build" → "Authentication"

3. **Enable Email/Password Sign-in**
   - Click on the "Sign-in method" tab
   - Find "Email/Password" in the list
   - Click on it
   - Toggle "Enable" to ON
   - Click "Save"

4. **Test Account Creation**
   - Try creating an account again in the app
   - Check the console logs for any errors

## Common Issues:

### "Operation not allowed" error
- **Solution**: Email/Password authentication is not enabled (see steps above)

### "Network request failed" error
- **Solution**: Check your internet connection
- Make sure Firebase project is active

### Account created but can't login
- **Solution**: 
  - Check Firebase Console → Authentication → Users tab
  - Verify the user was created
  - Try resetting password if needed

## Verify Account Creation:

1. Go to Firebase Console → Authentication → Users
2. You should see all created accounts listed there
3. If accounts appear here but login fails, check the error message in the app

## Testing:

After enabling Email/Password:
1. Create a new account in the app
2. Check Firebase Console → Authentication → Users to confirm it was created
3. Log out and try logging back in with the same credentials
4. Check console logs for detailed error messages

