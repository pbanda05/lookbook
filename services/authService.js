// Authentication Service for Social Logins
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import {
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
  OAuthProvider,
  signInAnonymously,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Complete web browser authentication for OAuth
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
// Get from Firebase Console -> Project Settings -> Your apps -> Web app config
// The Web client ID (not iOS/Android client ID)
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '897402009993-sstpujcp2k0eie5ls6pdlgp9ia7jrpa2.apps.googleusercontent.com';

// Google Sign In
export async function signInWithGoogle() {
  try {
    // Check if client ID is configured
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('xxxxxxxxxxxxx')) {
      throw new Error(
        'Google OAuth Client ID not configured. Please:\n' +
        '1. Go to Firebase Console → Project Settings → Your apps → Web app\n' +
        '2. Copy the OAuth client ID\n' +
        '3. Add EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_client_id to .env file\n' +
        '4. Restart your Expo server'
      );
    }

    // If user is already signed in, check if we should link accounts or sign out first
    if (auth.currentUser) {
      const currentEmail = auth.currentUser.email;
      console.log('User already signed in with email:', currentEmail);
      // We'll handle account linking after OAuth completes
      // For now, continue with OAuth flow - we'll link the account after
    }

    // Create OAuth request with proper configuration
    // Use Expo's proxy for redirect URI (required for Expo Go + Web client ID)
    let redirectUri = AuthSession.makeRedirectUri({
      useProxy: true, // 👈 IMPORTANT: Forces use of https://auth.expo.io/... instead of exp://...
    });

    // If makeRedirectUri didn't return the proxy URL, construct it explicitly
    // This can happen in some Expo Go environments where useProxy: true doesn't work
    if (!redirectUri.startsWith('https://auth.expo.io/')) {
      console.warn('⚠️ makeRedirectUri did not return proxy URL, constructing explicitly...');
      console.warn('Got:', redirectUri, '- Expected: https://auth.expo.io/@pbanda05/lookbook');
      
      // Try to get username and slug from Constants, fallback to known values
      const expoConfig = Constants.expoConfig || Constants.manifest2?.extra?.expoClient;
      const username = expoConfig?.owner || Constants.manifest?.owner || 'pbanda05';
      const slug = expoConfig?.slug || Constants.manifest?.slug || 'lookbook';
      
      redirectUri = `https://auth.expo.io/@${username}/${slug}`;
      console.log('✅ Using explicitly constructed proxy URL:', redirectUri);
    }

    console.log('Google OAuth redirect URI:', redirectUri);
    console.log('Make sure this URI is added to Google Cloud Console authorized redirect URIs');

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: redirectUri,
      usePKCE: true, // Enable PKCE for security (required by Google)
    });

    // Use Google's discovery document
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    // promptAsync will use the redirectUri we set in the AuthRequest
    const result = await request.promptAsync(discovery);

    console.log('OAuth result type:', result.type);
    console.log('OAuth result params:', result.params);
    
    if (result.type === 'success') {
      const { code, error, error_description } = result.params;
      
      // Check for errors in the response (sometimes OAuth errors come in success response)
      if (error) {
        console.error('OAuth error in response:', error, error_description);
        throw new Error(
          `Google OAuth error: ${error}${error_description ? '\n' + error_description : ''}`
        );
      }
      
      if (!code) {
        console.error('No authorization code in response. Params:', result.params);
        throw new Error('No authorization code received from Google.');
      }
      
      console.log('Received authorization code, exchanging for token...');

      // Exchange code for ID token using PKCE
      // Get the code verifier from the request
      const codeVerifier = request.codeVerifier;
      
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          code_verifier: codeVerifier,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed. Status:', tokenResponse.status, 'Response:', errorText);
        throw new Error(`Token exchange failed: ${errorText}`);
      }
      
      console.log('Token exchange successful');

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.id_token) {
        console.error('Token exchange response:', tokenData);
        throw new Error('Failed to exchange code for ID token. Response: ' + JSON.stringify(tokenData));
      }

      // Extract email from ID token for better error messages
      let userEmail = null;
      try {
        const tokenPayload = JSON.parse(atob(tokenData.id_token.split('.')[1]));
        userEmail = tokenPayload.email;
        console.log('Google sign-in email:', userEmail);
      } catch (e) {
        console.warn('Could not extract email from ID token:', e);
      }

      const credential = GoogleAuthProvider.credential(tokenData.id_token);
      
      // If user is already signed in, try to link the Google account
      if (auth.currentUser) {
        console.log('User already signed in, attempting to link Google account...');
        try {
          const linkedCredential = await linkWithCredential(auth.currentUser, credential);
          console.log('Google account linked successfully');
          return linkedCredential;
        } catch (linkError) {
          console.error('Account linking failed:', linkError.code, linkError.message);
          
          // If linking fails because credential already exists, that's okay
          if (linkError.code === 'auth/credential-already-in-use') {
            console.log('Google account already linked to this user');
            return { user: auth.currentUser }; // Return current user
          }
          
          // If it's the account-exists error, provide helpful message
          if (linkError.code === 'auth/account-exists-with-different-credential') {
            throw new Error(
              'This Google account is already linked to a different account.\n\n' +
              'Please sign out and sign in with your email/password account first.'
            );
          }
          
          // For other errors, throw them
          throw linkError;
        }
      }
      
      // Check if account exists BEFORE trying to sign in (to prevent Expo proxy error)
      if (userEmail) {
        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, userEmail);
          console.log('Available sign-in methods for', userEmail, ':', signInMethods);
          
          // If account exists with password but not Google, warn user before attempting
          if (signInMethods.includes('password') && !signInMethods.includes('google.com')) {
            throw new Error(
              'An account with this email already exists using email/password sign-in.\n\n' +
              'Please sign in with your email and password instead of Google.\n\n' +
              'If you want to use Google sign-in, you can link your Google account after signing in with email/password.'
            );
          }
        } catch (preCheckError) {
          // If it's our custom error, throw it
          if (preCheckError.message.includes('already exists')) {
            throw preCheckError;
          }
          // Otherwise, continue - the account might not exist yet
          console.log('Pre-check completed, proceeding with sign-in');
        }
      }
      
      try {
        const userCredential = await signInWithCredential(auth, credential);
        console.log('Google sign-in successful');
        return userCredential;
      } catch (error) {
        console.error('Firebase sign-in error:', error.code, error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        
        // Handle case where account exists with different credential (email/password)
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = userEmail || error.email;
          
          if (email) {
            try {
              // Check what sign-in methods are available for this email
              const signInMethods = await fetchSignInMethodsForEmail(auth, email);
              console.log('Available sign-in methods for', email, ':', signInMethods);
              
              if (signInMethods.includes('password')) {
                throw new Error(
                  'An account with this email already exists using email/password sign-in.\n\n' +
                  'Please sign in with your email and password instead of Google.\n\n' +
                  'If you want to use Google sign-in, you can link your Google account after signing in with email/password.'
                );
              } else {
                throw new Error(
                  'An account with this email already exists with a different sign-in method.\n\n' +
                  'Please sign in using: ' + signInMethods.join(' or ')
                );
              }
            } catch (methodsError) {
              // If fetchSignInMethodsForEmail fails, still provide helpful message
              if (methodsError.message.includes('already exists')) {
                throw methodsError;
              }
              throw new Error(
                'An account with this email already exists with a different sign-in method.\n\n' +
                'Please sign in with your email and password instead of Google.'
              );
            }
          } else {
            throw new Error(
              'An account with this email already exists with a different sign-in method.\n\n' +
              'Please sign in with your email and password instead of Google.'
            );
          }
        }
        
        // If user is already signed in, try to link the accounts
        if (auth.currentUser && error.code !== 'auth/account-exists-with-different-credential') {
          try {
            console.log('Attempting to link Google account to existing user');
            const linkedCredential = await linkWithCredential(auth.currentUser, credential);
            return linkedCredential;
          } catch (linkError) {
            console.error('Account linking failed:', linkError);
            // If linking fails, re-throw the original error
            throw error;
          }
        }
        
        // Re-throw other errors
        throw error;
      }
    } else if (result.type === 'cancel') {
      throw new Error('Google sign-in was cancelled');
    } else if (result.type === 'error') {
      // Handle OAuth errors from Expo proxy
      const errorMessage = result.error?.message || result.params?.error || 'Unknown OAuth error';
      const errorDescription = result.params?.error_description || '';
      console.error('OAuth error from proxy:', errorMessage, errorDescription);
      console.error('Full error result:', JSON.stringify(result, null, 2));
      
      // Check if it's the account-exists error
      if (errorMessage.includes('account') || errorMessage.includes('exists') || errorDescription?.includes('account')) {
        throw new Error(
          'An account with this email already exists with a different sign-in method.\n\n' +
          'Please sign in with your email and password instead of Google.'
        );
      }
      
      throw new Error(
        `Google sign-in failed: ${errorMessage}${errorDescription ? '\n' + errorDescription : ''}\n\n` +
        'If you already have an account with this email using email/password, please sign in with that method instead.'
      );
    } else if (result.type === 'dismiss') {
      throw new Error('Google sign-in was dismissed');
    } else {
      console.error('Unexpected OAuth result:', JSON.stringify(result, null, 2));
      throw new Error(`Google sign-in failed: ${result.type}. Please try signing in with your email and password if you already have an account.`);
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

// Apple Sign In
export async function signInWithApple() {
  try {
    // Check if Apple Authentication is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign-In is not available on this device. It only works on iOS devices with iOS 13+.');
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token');
    }

    const { identityToken } = credential;
    
    // Create Firebase credential
    const provider = new OAuthProvider('apple.com');
    const firebaseCredential = provider.credential({
      idToken: identityToken,
      rawNonce: null, // Apple doesn't provide rawNonce in Expo
    });

    const userCredential = await signInWithCredential(auth, firebaseCredential);
    
    // Update display name if available
    if (credential.fullName?.givenName || credential.fullName?.familyName) {
      const displayName = `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim();
      if (displayName) {
        try {
          await userCredential.user.updateProfile({ displayName });
        } catch (updateError) {
          console.log('Could not update display name:', updateError);
          // Continue even if display name update fails
        }
      }
    }

    return userCredential;
  } catch (error) {
    if (error.code === 'ERR_CANCELED' || error.message?.includes('cancelled')) {
      throw new Error('Apple sign-in was cancelled');
    }
    
    // Check for Firebase operation-not-allowed error
    if (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed')) {
      throw new Error(
        'Apple Sign-In is not enabled in Firebase.\n\n' +
        'Please:\n' +
        '1. Go to Firebase Console → Authentication → Sign-in method\n' +
        '2. Click on "Apple"\n' +
        '3. Toggle "Enable" to ON\n' +
        '4. Click "Save"\n' +
        '5. Wait 1-2 minutes for changes to propagate\n' +
        '6. Try again'
      );
    }
    
    console.error('Apple sign-in error:', error);
    throw error;
  }
}

// Anonymous/Guest Sign In
export async function signInAsGuest() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential;
  } catch (error) {
    console.error('Anonymous sign-in error:', error);
    throw error;
  }
}

// Check if Apple Authentication is available
export function isAppleAuthAvailable() {
  return AppleAuthentication.isAvailableAsync();
}

