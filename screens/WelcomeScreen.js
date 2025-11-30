import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#667EEA', '#764BA2', '#F093FB']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 8 }]}>
        <View style={styles.logoWrap}>
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            style={styles.logoGradient}
          >
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <MaterialCommunityIcons name="tshirt-crew" size={56} color="#6C63FF" style={styles.fallback} />
          </LinearGradient>
        </View>

        <View>
          <Text style={styles.title}>Lookbook</Text>
          <Text style={styles.sub}>Build your digital closet in minutes.</Text>
        </View>

        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6C63FF', '#8B7FFF']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.note}>Sign in to access all features.</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 24 
  },
  logoWrap: {
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    marginBottom: 24,
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 20, 
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  logo: { 
    width: 100, 
    height: 100, 
    resizeMode: 'contain',
    zIndex: 1,
  },
  fallback: { 
    position: 'absolute', 
    opacity: 0.0,
    zIndex: 0,
  },
  title: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  sub: { 
    fontSize: 20, 
    color: '#FFFFFF', 
    marginTop: 6, 
    marginBottom: 32, 
    textAlign: 'center',
    opacity: 0.95,
    fontWeight: '500',
  },
  cta: { 
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaGradient: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { 
    color: '#FFFFFF', 
    fontWeight: '800', 
    fontSize: 18,
    letterSpacing: 0.5,
  },
  note: { 
    marginTop: 20, 
    color: '#FFFFFF', 
    opacity: 0.8,
    fontSize: 14,
    fontWeight: '500',
  },
});
