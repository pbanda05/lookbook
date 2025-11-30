import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext();

const STORAGE_KEY = '@lookbook_wishlist_items';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading wishlist items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(item) {
    const newItem = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date().toISOString(),
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving wishlist item:', error);
    }
    return newItem;
  }

  async function removeItem(itemId) {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
    }
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);



