import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { searchShoppingItems } from '../services/shoppingSearch';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme';

export default function SearchItemScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { addItem } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) {
      Alert.alert('Empty search', 'Please enter a search term');
      return;
    }

    setSearching(true);
    try {
      const searchResults = await searchShoppingItems(searchQuery.trim());
      setResults(searchResults);
    } catch (error) {
      Alert.alert('Search failed', error.message || 'Please try again');
      setResults([]);
    } finally {
      setSearching(false);
    }
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
    <LinearGradient
      colors={['#FDF2F8', '#FCE7F3', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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



