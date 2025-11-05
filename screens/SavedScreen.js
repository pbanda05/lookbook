import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../theme';

export default function SavedScreen() {
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Saved</Text>
        <SearchBar placeholder="Search Saved" />
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={theme.colors.tabIcon} />
          <Text style={[styles.title, { color: theme.colors.text }]}>No saved outfits</Text>
          <Text style={[styles.caption, { color: theme.colors.subtext }]}>
            Generate and save your favorite looks
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 10 },
  header: { alignSelf: 'center', fontSize: 22, fontWeight: '800', marginTop: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  title: { fontWeight: '700', marginTop: 10 },
  caption: { marginTop: 4 },
});
