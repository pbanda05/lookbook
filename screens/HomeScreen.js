import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Replace these URLs anytime with your own photos (S3/Firebase/…)
  const items = [
    { id: '1', title: 'White Sneakers', img: 'https://images.unsplash.com/photo-1528701800489-20be3c2ea6b0?q=80&w=600' },
    { id: '2', title: 'Black Tee',      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600' },
    { id: '3', title: 'Blue Jeans',     img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600' },
    { id: '4', title: 'Denim Jacket',   img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 4 }]}>
      <View style={styles.header}>
        <Text style={styles.h1}>Home</Text>
      </View>

      <Text style={styles.section}>Your Items</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.tile}>
            <Image source={{ uri: item.img }} style={styles.img} />
            <Text style={styles.tileText}>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  h1: { fontSize: 28, fontWeight: '800' },
  section: { marginTop: 8, marginBottom: 8, fontSize: 18, fontWeight: '700', paddingHorizontal: 16 },
  tile: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 12, overflow: 'hidden', marginHorizontal: 16 },
  img: { width: '100%', height: 140 },
  tileText: { padding: 10, fontWeight: '700' },
});
