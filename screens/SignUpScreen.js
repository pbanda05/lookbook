import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';

export default function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

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
      console.log('User email:', userCredential.user.email);
      
      // Update the user's display name
      if (name.trim()) {
        try {
          await updateProfile(userCredential.user, {
            displayName: name.trim(),
          });
          console.log('Display name updated');
        } catch (updateError) {
          console.error('Error updating display name:', updateError);
          // Continue even if display name update fails
        }
      }
      
      // User is automatically signed in after registration
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
        },
      ]);
    } catch (e) {
      console.error('Sign up error:', e);
      console.error('Error code:', e.code);
      console.error('Error message:', e.message);
      
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
      
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        style={styles.input}
      />
      
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />
      
      <TouchableOpacity 
        style={[styles.btn, busy && { opacity: 0.7 }]} 
        onPress={onSignUp} 
        disabled={busy}
      >
        <Text style={styles.btnText}>{busy ? 'Creating account…' : 'Create Account'}</Text>
      </TouchableOpacity>

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
  title: { fontSize: 34, fontWeight: '800', marginTop: 12, marginBottom: 16 },
  input: {
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 14,
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    marginBottom: 12,
  },
  btn: { 
    backgroundColor: '#6C63FF', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 4 
  },
  btnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  linkText: { color: '#6B7280', fontSize: 14 },
  linkButton: { color: '#3B82F6', fontWeight: '600', fontSize: 14 },
});

