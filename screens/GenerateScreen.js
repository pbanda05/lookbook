import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SafeScreen from "../components/SafeScreen";
import { useTheme } from '../theme';

export default function GenerateScreen() {
  const [vibe, setVibe] = useState('');
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
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
          placeholder="e.g., casual, formal, date night"
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
          title="✨  Generate Outfit"
          onPress={() => {}}
          style={{ marginTop: 16 }}
        />

        <Text style={[styles.hint, { color: theme.colors.subtext }]}>
          Add at least 3 items to your closet to generate outfits
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
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
  hint: { textAlign: 'center', marginTop: 16 },
});
