import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from '../components/SafeScreen';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../theme';

export default function WishlistScreen() {
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>WishList</Text>
        <Text style={[styles.sub, { color: theme.colors.subtext }]}>
          Save items you wanna add to your wardrobe.
        </Text>

        <SearchBar placeholder="Search WishList" />

        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={theme.colors.tabIcon}/>
          <Text style={[styles.title, { color: theme.colors.text }]}>Your wishlist is empty</Text>
          <Text style={[styles.caption, { color: theme.colors.subtext }]}>Add items you'd love to own</Text>
          <PrimaryButton title="+  Add Item" onPress={() => {}} style={{ marginTop: 14, width: 160 }} />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 10 },
  header: { alignSelf: 'center', fontSize: 22, fontWeight: '800' },
  sub: { textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700', marginTop: 10 },
  caption: { marginTop: 4 },
});
