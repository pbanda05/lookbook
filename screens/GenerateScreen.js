import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from "../components/SafeScreen";
import { useCloset } from '../context/ClosetContext';
import { generateOutfitWithAI } from '../services/aiService';
import { useTheme } from '../theme';

export default function GenerateScreen() {
  const [vibe, setVibe] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState(null);
  const theme = useTheme();
  const { items } = useCloset();

  async function generateOutfit() {
    if (!vibe.trim()) {
      Alert.alert('No vibe specified', 'Please describe the vibe you want');
      return;
    }

    if (items.length < 3) {
      Alert.alert('Not enough items', 'Add at least 3 items to your closet to generate outfits');
      return;
    }

    setGenerating(true);
    setGeneratedOutfit(null);

    try {
      // Call AI service to generate outfit
      const aiResult = await generateOutfitWithAI(items, vibe.trim());
      
      // Get the selected items based on AI's indices
      const selectedItems = aiResult.selectedItemIndices
        .filter(index => index >= 0 && index < items.length)
        .map(index => items[index]);

      if (selectedItems.length === 0) {
        throw new Error('AI did not select any valid items');
      }

      setGeneratedOutfit({
        items: selectedItems,
        description: aiResult.description,
        reasoning: aiResult.reasoning,
      });
    } catch (error) {
      console.error('Outfit generation error:', error);
      
      let errorMessage = 'Failed to generate outfit. Please try again.';
      
      if (error.message?.includes('API key')) {
        errorMessage = 'OpenAI API key not configured. Please add your API key in services/aiService.js';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'API rate limit exceeded. Please try again later.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setGenerating(false);
    }
  }

  return (
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
              AI is creating your perfect outfit...
            </Text>
          </View>
        )}

        {generatedOutfit && !generating && (
          <View style={[styles.outfitContainer, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
            <Text style={[styles.outfitTitle, { color: theme.colors.text }]}>Your AI-Generated Outfit</Text>
            <Text style={[styles.outfitDescription, { color: theme.colors.subtext }]}>
              {generatedOutfit.description}
            </Text>
            {generatedOutfit.reasoning && (
              <Text style={[styles.outfitReasoning, { color: theme.colors.subtext }]}>
                {generatedOutfit.reasoning}
              </Text>
            )}
            <View style={styles.outfitItems}>
              {generatedOutfit.items.map((item, index) => (
                <View key={item.id} style={[styles.outfitItem, { borderColor: theme.colors.border }]}>
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
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, gap: 12 },
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
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  outfitTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  outfitDescription: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
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
