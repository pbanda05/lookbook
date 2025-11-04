import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from '../components/SafeScreen';
import { useTheme } from '../theme';

export default function WelcomeScreen({ navigation }) {
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
        <Ionicons name="shirt-outline" size={72} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Lookbook</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Welcome to{'\n'}<Text style={{ fontWeight: '700' }}>LookBook</Text>
        </Text>
        <Text style={{ color: theme.colors.subtext, marginTop: 6 }}>
          Your AI-powered Closet
        </Text>
        <PrimaryButton
          title="Get Started"
          onPress={() => navigation.replace('Main')}
          style={{ marginTop: 32 }}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { fontSize: 18, textAlign: 'center' },
});
