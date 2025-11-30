import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

const UserPreferencesContext = createContext();

function getStorageKey(userId) {
  return `@lookbook_user_preferences_${userId}`;
}

const DEFAULT_PREFERENCES = {
  stylePreferences: [],
  favoriteColors: [],
  sizes: {
    tops: '',
    bottoms: '',
    shoes: '',
  },
};

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, load their preferences
        setCurrentUserId(user.uid);
        loadPreferences(user.uid);
      } else {
        // User is signed out, reset to defaults
        setCurrentUserId(null);
        setPreferences(DEFAULT_PREFERENCES);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadPreferences(userId) {
    if (!userId) {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const storageKey = getStorageKey(userId);
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        // New user, start with default preferences
        setPreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setLoading(false);
    }
  }

  async function updatePreferences(newPreferences) {
    if (!currentUserId) {
      throw new Error('User must be logged in to update preferences');
    }

    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    try {
      const storageKey = getStorageKey(currentUserId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export const useUserPreferences = () => useContext(UserPreferencesContext);

