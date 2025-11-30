import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from '../components/SafeScreen';
import SearchBar from '../components/SearchBar';
import { useCloset } from '../context/ClosetContext';
import { useTheme } from '../theme';

export default function ClosetScreen({ navigation }) {
  const [q, setQ] = useState('');
  const theme = useTheme();
  const { items, removeItem } = useCloset();

  const filteredItems = useMemo(() => {
    if (!q.trim()) return items;
    return items.filter(item =>
      item.name?.toLowerCase().includes(q.toLowerCase())
    );
  }, [items, q]);

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Your Closet</Text>

        <SearchBar
          placeholder="Search outfits"
          value={q}
          onChangeText={setQ}
        />

        {filteredItems.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search" size={64} color={theme.colors.tabIcon} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {items.length === 0 ? 'No items yet' : 'No items found'}
            </Text>
            <Text style={[styles.caption, { color: theme.colors.subtext }]}>
              {items.length === 0
                ? 'Start building your digital closet'
                : 'Try a different search term'}
            </Text>

            {items.length === 0 && (
              <PrimaryButton
                title="+  Add Item"
                onPress={() => navigation.navigate('AddItem')}
                style={{ marginTop: 14, width: 160 }}
              />
            )}
          </View>
        ) : (
          <>
            <View style={styles.addButtonContainer}>
              <PrimaryButton
                title="+  Add Item"
                onPress={() => navigation.navigate('AddItem')}
                style={{ width: 140 }}
              />
            </View>
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <View style={[styles.itemCard, { borderColor: theme.colors.border }]}>
                  {item.imageUri && (
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  header: { fontSize: 28, fontWeight: '800', alignSelf: 'center', marginBottom: 6 },
  addButtonContainer: { paddingHorizontal: 16, marginBottom: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  caption: { marginTop: 4 },
  listContent: { padding: 16, paddingTop: 0 },
  row: { gap: 12, marginBottom: 12 },
  itemCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  itemImage: { width: '100%', height: 180 },
  itemInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: { flex: 1, fontSize: 14, fontWeight: '600' },
  deleteButton: { padding: 4 },
});
