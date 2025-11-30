import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

const ClosetContext = createContext();

function getStorageKey(userId) {
  return `@lookbook_closet_items_${userId}`;
}

export function ClosetProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, load their items
        setCurrentUserId(user.uid);
        loadItems(user.uid);
      } else {
        // User is signed out, clear items
        setCurrentUserId(null);
        setItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadItems(userId) {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const storageKey = getStorageKey(userId);
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // New user, start with empty array
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(item) {
    if (!currentUserId) {
      throw new Error('User must be logged in to add items');
    }

    const newItem = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date().toISOString(),
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    try {
      const storageKey = getStorageKey(currentUserId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving item:', error);
    }
    return newItem;
  }

  async function removeItem(itemId) {
    if (!currentUserId) {
      return;
    }

    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    try {
      const storageKey = getStorageKey(currentUserId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));
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



