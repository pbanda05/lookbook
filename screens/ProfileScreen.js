import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useCloset } from '../context/ClosetContext';
import { useSavedOutfits } from '../context/SavedOutfitsContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { auth } from '../firebaseConfig';
import { useTheme } from '../theme';

const STYLE_OPTIONS = [
  'minimalist', 'bohemian', 'streetwear', 'classic', 'preppy', 
  'edgy', 'romantic', 'sporty', 'vintage', 'casual', 'formal'
];

const COLOR_OPTIONS = [
  'Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown', 
  'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow'
];

function Stat({ icon, value, label, theme }) {
  return (
    <View style={[
      styles.stat,
      { backgroundColor: theme.colors.white, borderColor: theme.colors.border }
    ]}>
      {icon}
      <Text style={[styles.statNum, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { items } = useCloset();
  const { outfits: savedOutfits } = useSavedOutfits();
  const { preferences, updatePreferences } = useUserPreferences();
  const [editingPreferences, setEditingPreferences] = useState(false);
  
  const user = auth.currentUser;
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  // Count generated outfits (outfits that were generated, not just saved)
  // For now, we'll count saved outfits as generated outfits
  const generatedOutfitsCount = savedOutfits.length;

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }

  function toggleStylePreference(style) {
    const current = preferences.stylePreferences || [];
    const updated = current.includes(style)
      ? current.filter(s => s !== style)
      : [...current, style];
    updatePreferences({ stylePreferences: updated });
  }

  function toggleColorPreference(color) {
    const current = preferences.favoriteColors || [];
    const updated = current.includes(color)
      ? current.filter(c => c !== color)
      : [...current, color];
    updatePreferences({ favoriteColors: updated });
  }

  function updateSize(category, size) {
    updatePreferences({
      sizes: {
        ...preferences.sizes,
        [category]: size,
      },
    });
  }

  return (
    <LinearGradient
      colors={['#E0E7FF', '#DDD6FE', '#F3F4F6']}
      style={styles.gradient}
    >
      <SafeScreen scroll>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Profile</Text>

        {/* Real-time Stats */}
        <View style={styles.statsRow}>
          <Stat
            icon={<Ionicons name="shirt-outline" size={20} color={theme.colors.primary} />}
            value={items.length}
            label="Items"
            theme={theme}
          />
          <Stat
            icon={<Ionicons name="sparkles-outline" size={20} color={theme.colors.primary} />}
            value={generatedOutfitsCount}
            label="Outfits"
            theme={theme}
          />
          <Stat
            icon={<Ionicons name="heart-outline" size={20} color={theme.colors.primary} />}
            value={savedOutfits.length}
            label="Favorites"
            theme={theme}
          />
        </View>

        {/* User Info */}
        <View style={[
          styles.card,
          { backgroundColor: theme.colors.white, borderColor: theme.colors.border }
        ]}>
          <Text style={[styles.cardTitle, { color: theme.colors.subtext }]}>Name</Text>
          <Text style={[styles.cardValue, { color: theme.colors.text }]}>{userName}</Text>
          <Text style={[styles.cardTitle, { marginTop: 12, color: theme.colors.subtext }]}>Email</Text>
          <Text style={[styles.cardValue, { color: theme.colors.text }]}>{userEmail}</Text>
        </View>

        {/* Style Preferences */}
        <View style={[
          styles.card,
          { backgroundColor: theme.colors.white, borderColor: theme.colors.border }
        ]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.cardHeader, { color: theme.colors.text }]}>Style Preferences</Text>
            <TouchableOpacity onPress={() => setEditingPreferences(!editingPreferences)}>
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                {editingPreferences ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tags}>
            {STYLE_OPTIONS.map(style => {
              const isSelected = (preferences.stylePreferences || []).includes(style);
              return (
                <TouchableOpacity
                  key={style}
                  onPress={() => editingPreferences && toggleStylePreference(style)}
                  disabled={!editingPreferences}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                >
                  <Text style={{
                    color: isSelected ? '#fff' : theme.colors.subtext,
                    fontWeight: isSelected ? '600' : '400',
                  }}>
                    {style}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.cardTitle, { marginTop: 16, color: theme.colors.subtext }]}>Favorite Colors</Text>
          <View style={styles.tags}>
            {COLOR_OPTIONS.map(color => {
              const isSelected = (preferences.favoriteColors || []).includes(color);
              return (
                <TouchableOpacity
                  key={color}
                  onPress={() => editingPreferences && toggleColorPreference(color)}
                  disabled={!editingPreferences}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                >
                  <Text style={{
                    color: isSelected ? '#fff' : theme.colors.subtext,
                    fontWeight: isSelected ? '600' : '400',
                  }}>
                    {color}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.cardTitle, { marginTop: 16, color: theme.colors.subtext }]}>Sizes</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            {['tops', 'bottoms', 'shoes'].map(category => (
              <View
                key={category}
                style={[
                  styles.sizeBox,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.white,
                  }
                ]}
              >
                <Text style={{ color: theme.colors.text, fontSize: 12, marginBottom: 4 }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                {editingPreferences ? (
                  <TextInput
                    placeholder="Size"
                    value={preferences.sizes?.[category] || ''}
                    onChangeText={(text) => updateSize(category, text)}
                    style={[styles.sizeInput, { color: theme.colors.text }]}
                    placeholderTextColor={theme.colors.subtext}
                  />
                ) : (
                  <Text style={{ fontWeight: '700', color: theme.colors.text }}>
                    {preferences.sizes?.[category] || '—'}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            {
              borderColor: theme.colors.border,
            }
          ]}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.colors.subtext} />
          <Text style={{ marginLeft: 6, color: theme.colors.text, fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
        </ScrollView>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  stat: { flex: 1, borderRadius: 12, borderWidth: 1, alignItems: 'center', paddingVertical: 14 },
  statNum: { fontWeight: '800', marginTop: 6, fontSize: 20 },
  statLabel: { marginTop: 2, fontSize: 12 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginTop: 8 },
  cardHeader: { fontWeight: '700', fontSize: 18 },
  cardTitle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: '500' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  sizeBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  sizeInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
  },
  logoutButton: {
    marginTop: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
