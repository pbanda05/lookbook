import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useTheme } from '../theme';

const TREND_DATA = {
  All: [
    { id: '1', name: 'Mocha Mousse Leather Biker Jacket', category: 'Tops', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80' },
    { id: '2', name: 'Faded Terracotta Wide-Leg Trousers', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop&q=80' },
    { id: '3', name: 'Suede Ankle Boots in Sand', category: 'Shoes', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&q=80' },
    { id: '4', name: 'Rimless Gradient-Tinted Sunglasses', category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&q=80' },
    { id: '5', name: 'Oversized Denim Shirt', category: 'Tops', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&q=80' },
    { id: '6', name: 'Cargo Pants with Utility Pockets', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80' },
    { id: '7', name: 'Platform Sneakers', category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80' },
    { id: '8', name: 'Chain Link Belt', category: 'Accessories', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&q=80' },
  ],
  Tops: [
    { id: '1', name: 'Mocha Mousse Leather Biker Jacket', category: 'Tops', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80' },
    { id: '5', name: 'Oversized Denim Shirt', category: 'Tops', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&q=80' },
    { id: '9', name: 'Cropped Knit Sweater', category: 'Tops', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&q=80' },
    { id: '10', name: 'Silk Blouse with Bow', category: 'Tops', image: 'https://images.unsplash.com/photo-1594938291221-94f313d0a4cd?w=400&h=400&fit=crop&q=80' },
  ],
  Bottoms: [
    { id: '2', name: 'Faded Terracotta Wide-Leg Trousers', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop&q=80' },
    { id: '6', name: 'Cargo Pants with Utility Pockets', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80' },
    { id: '11', name: 'Pleated Midi Skirt', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80' },
    { id: '12', name: 'High-Waisted Wide Leg Jeans', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80' },
  ],
  Shoes: [
    { id: '3', name: 'Suede Ankle Boots in Sand', category: 'Shoes', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&q=80' },
    { id: '7', name: 'Platform Sneakers', category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80' },
    { id: '13', name: 'Mary Jane Flats', category: 'Shoes', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&q=80' },
    { id: '14', name: 'Chunky Heeled Loafers', category: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80' },
  ],
  Accessories: [
    { id: '4', name: 'Rimless Gradient-Tinted Sunglasses', category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&q=80' },
    { id: '8', name: 'Chain Link Belt', category: 'Accessories', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&q=80' },
    { id: '15', name: 'Structured Tote Bag', category: 'Accessories', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop&q=80' },
    { id: '16', name: 'Oversized Bucket Hat', category: 'Accessories', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&q=80' },
  ],
};

function TrendCard({ item, theme }) {
  const [imageError, setImageError] = React.useState(false);
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.border
      }
    ]}>
      {item.image && !imageError ? (
        <Image 
          source={{ uri: item.image }} 
          style={styles.cardImage}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={[styles.cardText, { color: theme.colors.text }]} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );
}

export default function TrendsScreen() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const displayedTrends = TREND_DATA[selectedCategory] || TREND_DATA.All;

  return (
    <LinearGradient
      colors={['#FEF3C7', '#FDE68A', '#FEF9E7']}
      style={styles.gradient}
    >
      <SafeScreen>
        <View style={styles.container}>
          <Text style={[styles.header, { color: '#1F2937' }]}>Trends</Text>

          <View style={styles.categoryRow}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      shadowColor: isSelected ? theme.colors.primary : 'transparent',
                      shadowOpacity: isSelected ? 0.2 : 0,
                      shadowRadius: isSelected ? 8 : 0,
                      elevation: isSelected ? 4 : 0,
                    }
                  ]}
                >
                  <Text style={{ 
                    color: isSelected ? '#fff' : theme.colors.text,
                    fontWeight: isSelected ? '700' : '500',
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.section, { color: '#1F2937' }]}>
            Trending {selectedCategory === 'All' ? 'Now' : selectedCategory}
          </Text>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {displayedTrends.map((item) => (
                <TrendCard key={item.id} item={item} theme={theme} />
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
  scrollView: { flex: 1 },
  gridContainer: { paddingBottom: 20 },
  header: { alignSelf: 'center', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  categoryRow: { flexDirection: 'row', gap: 10, marginVertical: 12, flexWrap: 'wrap' },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1.5 },
  section: { fontWeight: '800', fontSize: 20, textAlign: 'center', marginVertical: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { 
    width: '47%', 
    height: 180, 
    borderRadius: 16, 
    borderWidth: 1, 
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 120, backgroundColor: '#F3F4F6' },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  cardText: { 
    padding: 10, 
    fontSize: 12, 
    fontWeight: '600',
    textAlign: 'center',
  },
});
