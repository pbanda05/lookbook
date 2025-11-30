import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { signInWithGoogle, signInWithApple, isAppleAuthAvailable } from '../services/authService';

export default function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    isAppleAuthAvailable().then(setAppleAvailable);
  }, []);

  async function handleGoogleSignIn() {
    try {
      setBusy(true);
      const userCredential = await signInWithGoogle();
      console.log('Google sign-up successful:', userCredential.user.uid);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      console.error('Google sign-up error:', error);
      if (error.message?.includes('cancelled')) {
        return;
      }
      Alert.alert('Sign up failed', 'Failed to sign up with Google. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleAppleSignIn() {
    try {
      setBusy(true);
      const userCredential = await signInWithApple();
      console.log('Apple sign-up successful:', userCredential.user.uid);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      console.error('Apple sign-up error:', error);
      if (error.message?.includes('cancelled')) {
        return;
      }
      Alert.alert('Sign up failed', 'Failed to sign up with Apple. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function onSignUp() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please make sure both passwords are the same');
      return;
    }

    try {
      setBusy(true);
      console.log('Attempting to create account with email:', email.trim());
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('Account created successfully:', userCredential.user.uid);
      
      if (name.trim()) {
        try {
          await updateProfile(userCredential.user, {
            displayName: name.trim(),
          });
          console.log('Display name updated');
        } catch (updateError) {
          console.error('Error updating display name:', updateError);
        }
      }
      
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
        },
      ]);
    } catch (e) {
      console.error('Sign up error:', e);
      
      let errorMessage = 'Failed to create account. Please try again.';
      if (e.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (e.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (e.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = `Error: ${e.message || e.code || 'Unknown error'}`;
      }
      Alert.alert('Sign up failed', errorMessage);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Lookbook! Choose how you'd like to sign up.</Text>

      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        {/* Google Sign Up */}
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton, busy && { opacity: 0.6 }]}
          onPress={handleGoogleSignIn}
          disabled={busy}
        >
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Apple Sign Up - Only show on iOS */}
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

      {/* Email Sign Up */}
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
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={styles.input}
            editable={!busy}
          />
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
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            editable={!busy}
          />
          <TouchableOpacity
            style={[styles.emailSubmitButton, busy && { opacity: 0.7 }]}
            onPress={onSignUp}
            disabled={busy}
          >
            <Text style={styles.emailSubmitText}>{busy ? 'Creating account…' : 'Create Account'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEmailForm(false)}
            style={styles.cancelEmailButton}
          >
            <Text style={styles.cancelEmailText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sign In Link */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.linkButton}>Sign in</Text>
        </TouchableOpacity>
      </View>
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
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: { color: '#6B7280', fontSize: 14 },
  linkButton: { color: '#3B82F6', fontWeight: '600', fontSize: 14 },
});
