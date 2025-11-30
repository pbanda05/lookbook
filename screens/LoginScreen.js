import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onLogin() {
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
      console.log('User email:', userCredential.user.email);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      console.error('Login error:', e);
      console.error('Error code:', e.code);
      console.error('Error message:', e.message);
      
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

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Sign in</Text>
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
      <TouchableOpacity style={[styles.btn, busy && { opacity: 0.7 }]} onPress={onLogin} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Signing in…' : 'Sign in'}</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
          <Text style={styles.linkButton}>Create one</Text>
        </TouchableOpacity>
      </View>

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
  title: { fontSize: 34, fontWeight: '800', marginTop: 12, marginBottom: 16 },
  input: {
    backgroundColor: 'white', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12,
  },
  btn: { backgroundColor: '#6C63FF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
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
