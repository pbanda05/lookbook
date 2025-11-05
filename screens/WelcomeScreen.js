// screens/WelcomeScreen.js
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 8 }]}>
      <View style={styles.logoWrap}>
        {/* Try to load your logo.png. If it fails, show fallback icon */}
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Fallback (kept behind the image visually similar size) */}
        <MaterialCommunityIcons name="tshirt-crew" size={56} color="#6C63FF" style={styles.fallback} />
      </View>

      <Text style={styles.title}>Lookbook</Text>
      <Text style={styles.sub}>Build your digital closet in minutes.</Text>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.ctaText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.note}>Sign in to access all features.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },

  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F7FB', paddingHorizontal: 24 },
  logoWrap: {
    width: 112, height: 112, borderRadius: 56, marginBottom: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'white', borderWidth: 1, borderColor: '#ECECEC',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  logo: { width: 112, height: 112, resizeMode: 'contain' },
  fallback: { position: 'absolute', opacity: 0.0 }, // hidden if logo exists
  title: { fontSize: 40, fontWeight: '800', color: '#13151A' },
  sub: { fontSize: 18, color: '#6B7280', marginTop: 6, marginBottom: 22, textAlign: 'center' },
  cta: { backgroundColor: '#6C63FF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 16 },
  note: { marginTop: 12, color: '#9095A1' },
});
