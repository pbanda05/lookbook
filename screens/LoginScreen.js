import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { signInWithGoogle, signInWithApple, signInAsGuest, isAppleAuthAvailable } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    // Check if Apple Authentication is available
    isAppleAuthAvailable().then(setAppleAvailable);
  }, []);

  async function handleGoogleSignIn() {
    try {
      setBusy(true);
      const userCredential = await signInWithGoogle();
      console.log('Google sign-in successful:', userCredential.user.uid);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.message?.includes('cancelled')) {
        return; // User cancelled, don't show error
      }
      
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      if (error.message?.includes('not configured') || error.message?.includes('Client ID')) {
        errorMessage = error.message;
      } else if (error.message?.includes('404') || error.message?.includes('not found')) {
        errorMessage = 'Google OAuth Client ID not configured correctly.\n\n' +
          'Please:\n' +
          '1. Go to Firebase Console → Project Settings → Your apps → Web app\n' +
          '2. Copy the OAuth client ID\n' +
          '3. Add EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_client_id to .env file\n' +
          '4. Restart your Expo server';
      }
      
      Alert.alert('Sign in failed', errorMessage);
    } finally {
      setBusy(false);
    }
  }

  async function handleAppleSignIn() {
    try {
      setBusy(true);
      const userCredential = await signInWithApple();
      console.log('Apple sign-in successful:', userCredential.user.uid);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      console.error('Apple sign-in error:', error);
      if (error.message?.includes('cancelled')) {
        return; // User cancelled, don't show error
      }
      Alert.alert('Sign in failed', 'Failed to sign in with Apple. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailSignIn() {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Password required', 'Please enter your password');
      return;
    }

    try {
      setBusy(true);
      console.log('Attempting to login with email:', email.trim());
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('Login successful:', userCredential.user.uid);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      console.error('Login error:', e);
      
      let errorMessage = 'Failed to sign in. Please try again.';
      if (e.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please create an account first.';
      } else if (e.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (e.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = `Error: ${e.message || e.code || 'Unknown error'}`;
      }
      Alert.alert('Login failed', errorMessage);
    } finally {
      setBusy(false);
    }
  }

  async function handleGuestSignIn() {
    try {
      setBusy(true);
      const userCredential = await signInAsGuest();
      console.log('Guest sign-in successful:', userCredential.user.uid);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      console.error('Guest sign-in error:', error);
      Alert.alert('Sign in failed', 'Failed to sign in as guest. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Welcome back! Choose how you'd like to sign in.</Text>

      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        {/* Google Sign In */}
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton, busy && { opacity: 0.6 }]}
          onPress={handleGoogleSignIn}
          disabled={busy}
        >
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Apple Sign In - Only show on iOS */}
        {appleAvailable && Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton, busy && { opacity: 0.6 }]}
            onPress={handleAppleSignIn}
            disabled={busy}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Separator */}
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Email Sign In */}
      {!showEmailForm ? (
        <TouchableOpacity
          style={[styles.emailButton, busy && { opacity: 0.6 }]}
          onPress={() => setShowEmailForm(true)}
          disabled={busy}
        >
          <Ionicons name="mail-outline" size={20} color="#6C63FF" />
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.emailForm}>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            editable={!busy}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            editable={!busy}
          />
          <TouchableOpacity
            style={[styles.emailSubmitButton, busy && { opacity: 0.7 }]}
            onPress={handleEmailSignIn}
            disabled={busy}
          >
            <Text style={styles.emailSubmitText}>{busy ? 'Signing in…' : 'Sign in'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEmailForm(false)}
            style={styles.cancelEmailButton}
          >
            <Text style={styles.cancelEmailText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guest Mode */}
      <TouchableOpacity
        style={styles.guestButton}
        onPress={handleGuestSignIn}
        disabled={busy}
      >
        <Text style={styles.guestText}>Continue as guest</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
          <Text style={styles.linkButton}>Create one</Text>
        </TouchableOpacity>
      </View>

      {/* Back to Welcome */}
      <TouchableOpacity 
        onPress={() => navigation.replace('Welcome')} 
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back to Welcome</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F7FB', paddingHorizontal: 24 },
  title: { fontSize: 34, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
  socialContainer: { gap: 12, marginBottom: 16 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    backgroundColor: '#fff',
    gap: 12,
    marginBottom: 12,
  },
  emailButtonText: {
    color: '#6C63FF',
    fontWeight: '700',
    fontSize: 16,
  },
  emailForm: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  emailSubmitButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  emailSubmitText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelEmailButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  cancelEmailText: {
    color: '#6B7280',
    fontSize: 14,
  },
  guestButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestText: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: { color: '#6B7280', fontSize: 14 },
  linkButton: { color: '#3B82F6', fontWeight: '600', fontSize: 14 },
  backButton: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backButtonText: { color: '#6B7280', textAlign: 'center', fontWeight: '600', fontSize: 14 },
});
