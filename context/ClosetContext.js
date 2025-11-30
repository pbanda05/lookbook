import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ClosetContext = createContext();

const STORAGE_KEY = '@lookbook_closet_items';

export function ClosetProvider({ children }) {
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
      console.error('Error loading items:', error);
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
      console.error('Error saving item:', error);
    }
    return newItem;
  }

  async function removeItem(itemId) {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  return (
    <ClosetContext.Provider value={{ items, addItem, removeItem, loading }}>
      {children}
    </ClosetContext.Provider>
  );
}

export const useCloset = () => useContext(ClosetContext);



