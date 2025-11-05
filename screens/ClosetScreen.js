import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from '../components/SafeScreen';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../theme';

export default function ClosetScreen() {
  const [q, setQ] = useState('');
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Your Closet</Text>

        <SearchBar
          placeholder="Search outfits"
          value={q}
          onChangeText={setQ}
        />

        <View style={styles.empty}>
          <Ionicons name="search" size={64} color={theme.colors.tabIcon} />
          <Text style={[styles.title, { color: theme.colors.text }]}>No items yet</Text>
          <Text style={[styles.caption, { color: theme.colors.subtext }]}>
            Start building your digital closet
          </Text>

          <PrimaryButton
            title="+  Add Item"
            onPress={() => {}}
            style={{ marginTop: 14, width: 160 }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  header: { fontSize: 28, fontWeight: '800', alignSelf: 'center', marginBottom: 6 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  caption: { marginTop: 4 },
});
