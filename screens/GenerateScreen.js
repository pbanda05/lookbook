import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from "../components/SafeScreen";
import { useCloset } from '../context/ClosetContext';
import { useSavedOutfits } from '../context/SavedOutfitsContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { generateOutfitWithAI } from '../services/aiService';
import { useTheme } from '../theme';


export default function GenerateScreen() {
  const [vibe, setVibe] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedOutfits, setGeneratedOutfits] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState(new Set());
  const theme = useTheme();
  const { items } = useCloset();
  const { saveOutfit } = useSavedOutfits();
  const { preferences } = useUserPreferences();

  // async function generateOutfit() {
  //   if (!vibe.trim()) {
  //     Alert.alert('No vibe specified', 'Please describe the vibe you want');
  //     return;
  //   }
  
  //   if (items.length < 3) {
  //     Alert.alert('Not enough items', 'Add at least 3 items to your closet to generate outfits');
  //     return;
  //   }
  
  //   setGenerating(true);
  //   setGeneratedOutfits([]);
  //   setSavedOutfits(new Set());
  
  //   try {
  //     const numOutfits = Math.min(5, Math.max(3, Math.floor(items.length / 2)));
  //     const outfits = [];
  //     const previousOutfits = []; // <-- store arrays of indices here
  
  //     for (let i = 0; i < numOutfits; i++) {
  //       const aiResult = await generateOutfitWithAI(
  //         items,
  //         vibe.trim(),
  //         preferences,       // from useUserPreferences()
  //         previousOutfits    // NEW: tell the generator what we’ve already used
  //       );
  
  //       const selectedItems = aiResult.selectedItemIndices
  //         ?.filter(idx => idx >= 0 && idx < items.length)
  //         .map(idx => items[idx]) || [];
  
  //       if (selectedItems.length === 0) {
  //         continue;
  //       }
  
  //       outfits.push({
  //         id: `outfit-${Date.now()}-${i}`,
  //         items: selectedItems,
  //         description: aiResult.description || `Outfit option ${i + 1}`,
  //         reasoning: aiResult.reasoning || '',
  //       });
  
  //       // remember this outfit so next call avoids the same combo
  //       previousOutfits.push(aiResult.selectedItemIndices || []);
  //     }
  
  //     if (outfits.length === 0) {
  //       throw new Error('Failed to generate any valid outfits');
  //     }
  
  //     setGeneratedOutfits(outfits);
  //   } catch (error) {
  //     console.error('Outfit generation error:', error);
  //     let errorMessage = 'Failed to generate outfit. Please try again.';
  
  //     if (error.message?.includes('API key')) {
  //       errorMessage =
  //         'OpenAI API key not configured. Please add your API key in services/aiService.js';
  //     } else if (error.message?.includes('rate limit')) {
  //       errorMessage = 'API rate limit exceeded. Please try again later.';
  //     } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
  //       errorMessage = 'Network error. Please check your internet connection.';
  //     }
  
  //     Alert.alert('Error', errorMessage);
  //   } finally {
  //     setGenerating(false);
  //   }
  // }
  async function generateOutfit() {
    if (!vibe.trim()) {
      Alert.alert('No vibe specified', 'Please describe the vibe you want');
      return;
    }

    if (items.length < 3) {
      Alert.alert(
        'Not enough items',
        'Add at least 3 items to your closet to generate outfits'
      );
      return;
    }

    setGenerating(true);
    setGeneratedOutfits([]);
    setSavedOutfits(new Set());

    try {
      const numOutfits = Math.min(
        5,
        Math.max(3, Math.floor(items.length / 2))
      );

      const previousOutfits = []; // each element = [indices...]
      const outfits = [];

      for (let i = 0; i < numOutfits; i++) {
        const aiResult = await generateOutfitWithAI(
          items,
          vibe.trim(),
          preferences,
          previousOutfits
        );

        const selectedItems = aiResult.selectedItemIndices
          .filter((idx) => idx >= 0 && idx < items.length)
          .map((idx) => items[idx]);

        if (selectedItems.length === 0) {
          continue;
        }

        // remember this combo so we don't repeat it
        previousOutfits.push(aiResult.selectedItemIndices);

        outfits.push({
          id: `outfit-${Date.now()}-${i}`,
          items: selectedItems,
          description:
            aiResult.description || `Outfit option ${i + 1}`,
          reasoning: aiResult.reasoning || '',
        });
      }

      if (outfits.length === 0) {
        throw new Error('Failed to generate any valid outfits');
      }

      setGeneratedOutfits(outfits);
    } catch (error) {
      console.error('Outfit generation error:', error);

      let errorMessage =
        'Failed to generate outfit. Please try again.';

      if (error.message?.includes('API key')) {
        errorMessage =
          'OpenAI API key not configured. Please add your API key in services/aiService.js';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'API rate limit exceeded. Please try again later.';
      } else if (
        error.message?.includes('network') ||
        error.message?.includes('fetch')
      ) {
        errorMessage =
          'Network error. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setGenerating(false);
    }
  }


  async function handleSaveOutfit(outfit) {
    try {
      await saveOutfit({
        ...outfit,
        vibe: vibe.trim(),
      });
      setSavedOutfits(new Set([...savedOutfits, outfit.id]));
      Alert.alert('Success', 'Outfit saved to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save outfit');
    }
  }

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#F0FDF4']}
      style={styles.gradient}
    >
      <SafeScreen scroll>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.header, { color: theme.colors.text }]}>
          Generate Outfit
        </Text>

        <View style={styles.avatar}>
          <Ionicons
            name="person-circle-outline"
            size={48}
            color={theme.colors.tabIcon}
          />
        </View>

        <Text style={[styles.prompt, { color: theme.colors.text }]}>
          What's today's vibe?
        </Text>

        <TextInput
          placeholder="e.g., casual, formal, date night, business casual"
          value={vibe}
          onChangeText={setVibe}
          placeholderTextColor={theme.colors.subtext}
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.grayBG,
            }
          ]}
        />

        <PrimaryButton
          title={generating ? 'Generating...' : '✨  Generate Outfit'}
          onPress={generateOutfit}
          disabled={generating || items.length < 3}
          style={{ marginTop: 16 }}
        />

        {items.length < 3 && (
          <Text style={[styles.hint, { color: theme.colors.subtext }]}>
            Add at least 3 items to your closet to generate outfits
          </Text>
        )}

        {generating && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.subtext }]}>
              🤖 AI is analyzing your closet and creating your perfect outfit...
            </Text>
          </View>
        )}

        {generatedOutfits.length > 0 && !generating && (
          <View style={styles.outfitsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {generatedOutfits.length} Outfit Options
            </Text>
            {generatedOutfits.map((outfit) => {
              const isSaved = savedOutfits.has(outfit.id);
              return (
                <View key={outfit.id} style={[styles.outfitContainer, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[styles.outfitTitle, { color: theme.colors.text }]}>Option {generatedOutfits.indexOf(outfit) + 1}</Text>
                    <TouchableOpacity
                      onPress={() => handleSaveOutfit(outfit)}
                      disabled={isSaved}
                      style={[styles.saveButton, isSaved && { opacity: 0.5 }]}
                    >
                      <Ionicons 
                        name={isSaved ? "heart" : "heart-outline"} 
                        size={20} 
                        color={isSaved ? "#EF4444" : theme.colors.subtext} 
                      />
                      <Text style={[styles.saveButtonText, { color: isSaved ? "#EF4444" : theme.colors.subtext }]}>
                        {isSaved ? 'Saved' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.outfitDescription, { color: theme.colors.subtext }]}>
                    {outfit.description}
                  </Text>
                  {outfit.reasoning && (
                    <Text style={[styles.outfitReasoning, { color: theme.colors.subtext }]}>
                      {outfit.reasoning}
                    </Text>
                  )}
                  <View style={styles.outfitItems}>
                    {outfit.items.map((item, index) => (
                      <View key={item.id || index} style={[styles.outfitItem, { borderColor: theme.colors.border }]}>
                        {item.imageUri && (
                          <Image source={{ uri: item.imageUri }} style={styles.outfitItemImage} />
                        )}
                        <Text style={[styles.outfitItemName, { color: theme.colors.text }]} numberOfLines={2}>
                          {item.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
        </ScrollView>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 16, gap: 12, paddingBottom: 100 },
  outfitsSection: { marginTop: 16, gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  header: { alignSelf: 'center', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  avatar: { alignItems: 'center', marginTop: 6 },
  prompt: { marginTop: 12, fontWeight: '600' },
  input: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  hint: { textAlign: 'center', marginTop: 16, fontSize: 14 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: { fontSize: 16 },
  outfitContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  outfitTitle: { fontSize: 20, fontWeight: '800' },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButtonText: { fontSize: 14, fontWeight: '600' },
  outfitDescription: { fontSize: 14, marginBottom: 8, marginTop: 8, fontWeight: '600' },
  outfitReasoning: { fontSize: 12, marginBottom: 16, fontStyle: 'italic' },
  outfitItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  outfitItem: {
    width: '47%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  outfitItemImage: { width: '100%', height: 120 },
  outfitItemName: {
    padding: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});
