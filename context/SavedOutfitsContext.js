import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

const SavedOutfitsContext = createContext();

function getStorageKey(userId) {
  return `@lookbook_saved_outfits_${userId}`;
}

export function SavedOutfitsProvider({ children }) {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, load their outfits
        setCurrentUserId(user.uid);
        loadOutfits(user.uid);
      } else {
        // User is signed out, clear outfits
        setCurrentUserId(null);
        setOutfits([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadOutfits(userId) {
    if (!userId) {
      setOutfits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const storageKey = getStorageKey(userId);
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setOutfits(JSON.parse(stored));
      } else {
        // New user, start with empty array
        setOutfits([]);
      }
    } catch (error) {
      console.error('Error loading saved outfits:', error);
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveOutfit(outfit) {
    if (!currentUserId) {
      throw new Error('User must be logged in to save outfits');
    }

    const newOutfit = {
      id: Date.now().toString(),
      ...outfit,
      savedAt: new Date().toISOString(),
    };
    const updatedOutfits = [...outfits, newOutfit];
    setOutfits(updatedOutfits);
    try {
      const storageKey = getStorageKey(currentUserId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedOutfits));
    } catch (error) {
      console.error('Error saving outfit:', error);
    }
    return newOutfit;
  }

  async function removeOutfit(outfitId) {
    if (!currentUserId) {
      return;
    }

    const updatedOutfits = outfits.filter(outfit => outfit.id !== outfitId);
    setOutfits(updatedOutfits);
    try {
      const storageKey = getStorageKey(currentUserId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedOutfits));
    } catch (error) {
      console.error('Error removing outfit:', error);
    }
  }

  return (
    <SavedOutfitsContext.Provider value={{ outfits, saveOutfit, removeOutfit, loading }}>
      {children}
    </SavedOutfitsContext.Provider>
  );
}

export const useSavedOutfits = () => useContext(SavedOutfitsContext);

