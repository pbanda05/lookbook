// screens/HomeScreen.js
import React from 'react';
import { Text, View } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useTheme } from '../theme';

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <SafeScreen>
      <View>
        <Text style={{ fontSize: 40, fontWeight: '800', color: theme.colors.text }}>
          Home
        </Text>
        <Text style={{ fontSize: 22, marginTop: 10, color: theme.colors.subtext }}>
          Quick links & tips coming soon.
        </Text>
      </View>
    </SafeScreen>
  );
}
