import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SafeScreen from '../components/SafeScreen';
import SearchBar from '../components/SearchBar';
import { useSavedOutfits } from '../context/SavedOutfitsContext';
import { useTheme } from '../theme';

export default function SavedScreen() {
  const theme = useTheme();
  const { outfits, removeOutfit } = useSavedOutfits();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOutfits = useMemo(() => {
    if (!searchQuery.trim()) return outfits;
    return outfits.filter(outfit =>
      outfit.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.vibe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [outfits, searchQuery]);

  return (
    <LinearGradient
      colors={['#F0F4FF', '#E8F0FE', '#F6F7FB']}
      style={styles.gradient}
    >
      <SafeScreen>
        <View style={styles.container}>
          <Text style={[styles.header, { color: '#1F2937' }]}>Saved Outfits</Text>
          <SearchBar placeholder="Search Saved" value={searchQuery} onChangeText={setSearchQuery} />
          
          {filteredOutfits.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
              <Text style={[styles.title, { color: '#1F2937' }]}>
                {outfits.length === 0 ? 'No saved outfits' : 'No outfits found'}
              </Text>
              <Text style={[styles.caption, { color: '#6B7280' }]}>
                {outfits.length === 0 
                  ? 'Generate and save your favorite looks'
                  : 'Try a different search term'}
              </Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.outfitsGrid}
              showsVerticalScrollIndicator={false}
            >
              {filteredOutfits.map((outfit) => (
                <View key={outfit.id} style={[styles.outfitCard, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
                  <View style={styles.outfitHeader}>
                    <Text style={[styles.outfitVibe, { color: theme.colors.primary }]}>{outfit.vibe || 'Outfit'}</Text>
                    <TouchableOpacity onPress={() => removeOutfit(outfit.id)}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.outfitDescription, { color: '#1F2937' }]} numberOfLines={2}>
                    {outfit.description}
                  </Text>
                  <View style={styles.outfitItemsRow}>
                    {outfit.items?.slice(0, 3).map((item, idx) => (
                      <View key={idx} style={styles.outfitItemMini}>
                        {item.imageUri && (
                          <Image source={{ uri: item.imageUri }} style={styles.outfitItemImage} />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
  scrollView: { flex: 1 },
  header: { alignSelf: 'center', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, minHeight: 300 },
  title: { fontWeight: '700', marginTop: 10, fontSize: 18 },
  caption: { marginTop: 4, fontSize: 14 },
  outfitsGrid: { gap: 12, paddingBottom: 20 },
  outfitCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outfitVibe: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  outfitDescription: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  outfitItemsRow: { flexDirection: 'row', gap: 8 },
  outfitItemMini: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden' },
  outfitItemImage: { width: '100%', height: '100%' },
});
