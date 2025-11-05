// screens/LoginScreen.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setErr(null); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      navigation.replace('Home'); // or 'MainTabs' depending on your navigator
    } catch (e) {
      setErr(e.message || String(e));
    } finally { setLoading(false); }
  }

  async function handleRegister() {
    setErr(null); setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pw);
      navigation.replace('Home');
    } catch (e) {
      setErr(e.message || String(e));
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Lookbook</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={pw}
        onChangeText={setPw}
      />
      {err ? <Text style={styles.err}>{err}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={handleSignIn} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={handleRegister} disabled={loading}>
        <Text style={[styles.btnText, styles.ghostText]}>Create Account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 20, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, fontSize: 16 },
  btn: { backgroundColor: '#111', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#111' },
  ghostText: { color: '#111' },
  err: { color: '#b00020', textAlign: 'center' },
});
