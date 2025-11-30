import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme';

// Mock search results - In production, you'd use a real API like Google Shopping, Amazon, etc.
const MOCK_SEARCH_RESULTS = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    price: '$120',
    brand: 'Nike',
  },
  {
    id: '2',
    name: 'Levi\'s 501 Original Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    price: '$89',
    brand: 'Levi\'s',
  },
  {
    id: '3',
    name: 'Adidas Originals T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    price: '$35',
    brand: 'Adidas',
  },
  {
    id: '4',
    name: 'Zara Blazer',
    image: 'https://images.unsplash.com/photo-1594938291221-94f313d0a4cd?w=400',
    price: '$79',
    brand: 'Zara',
  },
  {
    id: '5',
    name: 'Converse Chuck Taylor',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    price: '$55',
    brand: 'Converse',
  },
];

export default function SearchItemScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { addItem } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  function handleSearch() {
    if (!searchQuery.trim()) {
      Alert.alert('Empty search', 'Please enter a search term');
      return;
    }

    setSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      // Filter mock results based on search query
      const filtered = MOCK_SEARCH_RESULTS.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : MOCK_SEARCH_RESULTS);
      setSearching(false);
    }, 500);
  }

  async function handleAddToWishlist(item) {
    try {
      await addItem({
        name: item.name,
        imageUri: item.image,
        price: item.price,
        brand: item.brand,
      });
      Alert.alert('Success', `${item.name} added to wishlist!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to wishlist');
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top, backgroundColor: theme.colors.grayBG || '#F6F7FB' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Search Items</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.subtext} />
          <TextInput
            placeholder="Search for items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.subtext}
            style={[styles.searchInput, { color: theme.colors.text }]}
            onSubmitEditing={handleSearch}
          />
        </View>
        <PrimaryButton
          title="Search"
          onPress={handleSearch}
          disabled={searching}
          style={{ width: 100 }}
        />
      </View>

      {searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.subtext }]}>Searching...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.resultCard, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.resultImage} />
              )}
              <View style={styles.resultInfo}>
                <Text style={[styles.resultBrand, { color: theme.colors.subtext }]}>{item.brand}</Text>
                <Text style={[styles.resultName, { color: theme.colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.resultPrice, { color: theme.colors.primary }]}>{item.price}</Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleAddToWishlist(item)}
                >
                  <Ionicons name="heart" size={16} color="#fff" />
                  <Text style={styles.addButtonText}>Add to Wishlist</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : searchQuery ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.tabIcon} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>No results found</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.subtext }]}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.tabIcon} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>Search for items</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.subtext }]}>
            Enter a search term to find items to add to your wishlist
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { padding: 4 },
  title: { fontSize: 20, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 16 },
  listContent: { padding: 16, paddingTop: 0 },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  resultImage: { width: 120, height: 120 },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  resultBrand: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  resultName: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  resultPrice: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptySubtext: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
});



