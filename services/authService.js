// Authentication Service for Social Logins
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { 
  GoogleAuthProvider, 
  signInWithCredential, 
  OAuthProvider,
  signInAnonymously 
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Complete web browser authentication for OAuth
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
// Get from Firebase Console -> Project Settings -> Your apps -> Web app config
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '897402009993-xxxxxxxxxxxxx.apps.googleusercontent.com';

// Google Sign In
export async function signInWithGoogle() {
  try {
    // Create OAuth request
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
        scheme: 'lookbook',
      }),
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success') {
      const { id_token } = result.params;
      if (!id_token) {
        throw new Error('No ID token received from Google');
      }
      const credential = GoogleAuthProvider.credential(id_token);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential;
    } else if (result.type === 'cancel') {
      throw new Error('Google sign-in was cancelled');
    } else {
      throw new Error('Google sign-in failed');
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

// Apple Sign In
export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token');
    }

    const { identityToken, authorizationCode } = credential;
    
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
        await userCredential.user.updateProfile({ displayName });
      }
    }

    return userCredential;
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      throw new Error('Apple sign-in was cancelled');
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

