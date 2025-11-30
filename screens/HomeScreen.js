import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { useCloset } from '../context/ClosetContext';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items } = useCloset();

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFF0F5', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 4 }]}>
      <View style={styles.header}>
        <Text style={styles.h1}>Home</Text>
      </View>

      <Text style={styles.section}>Your Items</Text>
      
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="shirt-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySub}>Add items to your closet to see them here</Text>
          <PrimaryButton
            title="+ Add Item"
            onPress={() => navigation.navigate('AddItem')}
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.tile}>
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.img} />
              )}
              <Text style={styles.tileText}>{item.name}</Text>
            </View>
          )}
        />
      )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  h1: { fontSize: 28, fontWeight: '800' },
  section: { marginTop: 8, marginBottom: 8, fontSize: 18, fontWeight: '700', paddingHorizontal: 16 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, color: '#0F172A' },
  emptySub: { fontSize: 14, color: '#6B7280', marginTop: 4, textAlign: 'center', paddingHorizontal: 32 },
  listContent: { padding: 16, paddingTop: 0, paddingBottom: 16 },
  row: { gap: 12, marginBottom: 12 },
  tile: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 12, overflow: 'hidden' },
  img: { width: '100%', height: 140 },
  tileText: { padding: 10, fontWeight: '700', fontSize: 14 },
});
