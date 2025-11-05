import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WishlistScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>WishList</Text>
      <TextInput placeholder="Search WishList" style={styles.search} />
      <View style={styles.empty}>
        <Text style={styles.bigIcon}>♡</Text>
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptySub}>Add items you'd love to own</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#F6F7FB', padding: 20 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 12 },
  search: { backgroundColor: 'white', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  bigIcon: { fontSize: 48, color: '#9CA3AF' },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { color: '#6B7280', marginBottom: 12 },
  btn: { backgroundColor: '#6C63FF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btnText: { color: 'white', fontWeight: '700' },
});
