// screens/WishListScreen.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { useWishlist } from '../context/WishlistContext';

export default function WishListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeItem } = useWishlist();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <LinearGradient
      colors={['#FDF2F8', '#FCE7F3', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.wrap}>
          <Text style={styles.title}>WishList</Text>
          <TextInput
            placeholder="Search WishList"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.search}
          />

          {filteredItems.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.bigIcon}>♡</Text>
              <Text style={styles.emptyTitle}>
                {items.length === 0 ? 'Your wishlist is empty' : 'No items found'}
              </Text>
              <Text style={styles.emptySub}>
                {items.length === 0
                  ? "Add items you'd love to own"
                  : 'Try a different search term'}
              </Text>
              {items.length === 0 && (
                <PrimaryButton
                  title="+ Add Item"
                  onPress={() => navigation.navigate('SearchItem')}
                  style={{ marginTop: 12 }}
                />
              )}
            </View>
          ) : (
            <>
              <View style={styles.addButtonContainer}>
                <PrimaryButton
                  title="+ Add Item"
                  onPress={() => navigation.navigate('SearchItem')}
                  style={{ width: 140 }}
                />
              </View>
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.itemCard}>
                    {item.imageUri && (
                      <Image 
                        source={{ uri: item.imageUri }} 
                        style={styles.itemImage}
                        defaultSource={require('../assets/placeholder.png')}
                        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                      />
                    )}
                    <View style={styles.itemInfo}>
                      {item.brand && (
                        <Text style={styles.itemBrand}>{item.brand}</Text>
                      )}
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      {item.price && (
                        <Text style={styles.itemPrice}>{item.price}</Text>
                      )}
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
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  wrap: { flex: 1, padding: 20, paddingBottom: 100 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 12, color: '#1F2937' },
  search: { backgroundColor: 'white', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  addButtonContainer: { marginBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  bigIcon: { fontSize: 48, color: '#9CA3AF' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  emptySub: { color: '#6B7280', marginBottom: 12 },
  listContent: { paddingBottom: 20 },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  itemImage: { width: 100, height: 100, backgroundColor: '#F3F4F6' },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemBrand: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginBottom: 4 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#6C63FF', marginBottom: 8 },
  deleteButton: { alignSelf: 'flex-start', padding: 4 },
});
