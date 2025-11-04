// components/SafeScreen.js
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

export default function SafeScreen({ children, scroll = false, style }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() || { colors: {} }; // ✅ fallback so grayBG never breaks

  const Container = scroll ? ScrollView : View;

  return (
    <Container
      contentContainerStyle={
        scroll
          ? [{
              paddingTop: insets.top + 8,
              paddingBottom: insets.bottom + 90,
              minHeight: '100%',
            }]
          : undefined
      }
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.grayBG || '#F7F7FB', // ✅ safe fallback
          paddingHorizontal: 20,
          paddingTop: scroll ? 0 : insets.top + 8,
          paddingBottom: scroll ? 0 : insets.bottom + 90,
        },
        style
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </Container>
  );
}
