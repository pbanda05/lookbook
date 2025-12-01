// Authentication Service for Social Logins
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
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

    if (result.type === 'success') {
      const { code } = result.params;
      if (!code) {
        throw new Error('No authorization code received from Google.');
      }

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
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.id_token) {
        throw new Error('Failed to exchange code for ID token. Response: ' + JSON.stringify(tokenData));
      }

      const credential = GoogleAuthProvider.credential(tokenData.id_token);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential;
    } else if (result.type === 'cancel') {
      throw new Error('Google sign-in was cancelled');
    } else {
      throw new Error(`Google sign-in failed: ${result.type}`);
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

