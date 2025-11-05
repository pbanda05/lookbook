import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';

const API = process.env.EXPO_PUBLIC_API_URL;

export default function DebugScreen() {
  const [out, setOut] = useState(null);

  async function ping(path, authz) {
    const headers = {};
    if (authz) {
      const u = auth.currentUser;
      const t = u ? await u.getIdToken(true) : null;
      if (t) headers.Authorization = `Bearer ${t}`;
    }
    const res = await fetch(`${API}${path}`, { headers });
    const json = await res.json();
    setOut({ path, status: res.status, json });
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <TouchableOpacity style={styles.btn} onPress={() => ping('/health')}>
        <Text style={styles.btnText}>/health</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => ping('/ready')}>
        <Text style={styles.btnText}>/ready</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => ping('/api/me', true)}>
        <Text style={styles.btnText}>/api/me (auth)</Text>
      </TouchableOpacity>

      <Text style={styles.mono} selectable>{JSON.stringify(out, null, 2)}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 10 },
  btn: { backgroundColor: '#111', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '600' },
  mono: { marginTop: 12, fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
