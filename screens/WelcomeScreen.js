// screens/WelcomeScreen.js
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: 'https://picsum.photos/seed/lookbook/600/400' }}
        style={styles.hero}
      />
      <Text style={styles.title}>Lookbook</Text>
      <Text style={styles.sub}>Build your digital closet in minutes.</Text>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text style={styles.ctaText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.note}>You can sign in from the Home screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F6F7FB' },
  hero: { width: '100%', height: 220, borderRadius: 16, marginBottom: 24 },
  title: { fontSize: 36, fontWeight: '800', color: '#13151A' },
  sub: { fontSize: 16, color: '#6B7280', marginTop: 6, marginBottom: 24 },
  cta: { backgroundColor: '#6C63FF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 16 },
  note: { marginTop: 12, color: '#9095A1' },
});
