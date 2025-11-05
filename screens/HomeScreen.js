// screens/HomeScreen.js
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';

const API = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen({ route, navigation }) {
  const user = route?.params?.user || auth.currentUser;
  const [me, setMe] = useState(null);
  const [status, setStatus] = useState(null);

  async function hitMe() {
    try {
      setStatus('Loading…');
      const token = await user?.getIdToken(true);
      const res = await fetch(`${API}/api/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      setMe({ status: res.status, json });
      setStatus(null);
    } catch (e) {
      setStatus(String(e));
    }
  }

  const items = [
    { id: '1', title: 'Black Tee', img: 'https://picsum.photos/seed/tee/200' },
    { id: '2', title: 'Blue Jeans', img: 'https://picsum.photos/seed/jeans/200' },
    { id: '3', title: 'White Sneakers', img: 'https://picsum.photos/seed/kicks/200' },
    { id: '4', title: 'Denim Jacket', img: 'https://picsum.photos/seed/jacket/200' },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.hi}>Hi, {user?.email || user?.uid || 'there'}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {__DEV__ && (
            <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate('Debug')}>
              <Text style={styles.smallBtnText}>Debug</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.smallBtn} onPress={() => signOut(auth)}>
            <Text style={styles.smallBtnText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.apiBtn} onPress={hitMe}>
        <Text style={styles.apiBtnText}>Check backend (/api/me)</Text>
      </TouchableOpacity>
      {status ? <Text style={styles.status}>{status}</Text> : null}

      {me ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>/api/me</Text>
          <Text selectable style={styles.mono}>{JSON.stringify(me, null, 2)}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>Your Items</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.tile}>
            <Image source={{ uri: item.img }} style={styles.img} />
            <Text style={styles.tileText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  hi: { fontSize: 20, fontWeight: '700' },
  smallBtn: { backgroundColor: '#111', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  smallBtnText: { color: 'white', fontWeight: '600' },
  apiBtn: { backgroundColor: '#111', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  apiBtnText: { color: 'white', fontWeight: '600' },
  status: { color: '#b00020', marginVertical: 6 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { fontWeight: '700', marginBottom: 8 },
  mono: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  section: { marginTop: 8, marginBottom: 8, fontSize: 16, fontWeight: '700' },
  tile: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 12, overflow: 'hidden' },
  img: { width: '100%', height: 120 },
  tileText: { padding: 8, fontWeight: '600' },
});
