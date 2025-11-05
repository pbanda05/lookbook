// screens/LoginScreen.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    try {
      setBusy(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      Alert.alert('Login failed', String(e?.message || e));
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

      <TouchableOpacity onPress={() => navigation.replace('Welcome')} style={{ marginTop: 14 }}>
        <Text style={{ color: '#6B7280' }}>Back to Welcome</Text>
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
});
