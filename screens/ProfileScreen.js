import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useTheme } from '../theme';

function Stat({ icon, label, theme }) {
  return (
    <View style={[
      styles.stat,
      { backgroundColor: theme.colors.white, borderColor: theme.colors.border }
    ]}>
      {icon}
      <Text style={[styles.statNum, { color: theme.colors.text }]}>0</Text>
      <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Profile</Text>

        <View style={styles.statsRow}>
          <Stat icon={<Ionicons name="shirt-outline" size={20} color={theme.colors.primary}/>} label="Items" theme={theme}/>
          <Stat icon={<Ionicons name="sparkles-outline" size={20} color={theme.colors.primary}/>} label="Outfits" theme={theme}/>
          <Stat icon={<Ionicons name="heart-outline" size={20} color={theme.colors.primary}/>} label="Favorites" theme={theme}/>
        </View>

        <View style={[
          styles.card,
          { backgroundColor: theme.colors.white, borderColor: theme.colors.border }
        ]}>
          <Text style={[styles.cardTitle, { color: theme.colors.subtext }]}>Name</Text>
          <Text style={{ color: theme.colors.text }}>Prateek Banda</Text>
          <Text style={[styles.cardTitle, { marginTop: 12, color: theme.colors.subtext }]}>Email</Text>
          <Text style={{ color: theme.colors.text }}>bandaprateek0@gmail.com</Text>
        </View>

        <View style={[
          styles.card,
          { backgroundColor: theme.colors.white, borderColor: theme.colors.border }
        ]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.cardHeader, { color: theme.colors.text }]}>Style Preferences</Text>
            <Text style={{ color: theme.colors.subtext }}>Edit</Text>
          </View>

          <View style={styles.tags}>
            {['minimalist','bohemian','streetwear','classic','preppy','edgy','romantic','sporty','vintage'].map(t => (
              <View
                key={t}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 999,
                  backgroundColor: theme.colors.white
                }}
              >
                <Text style={{ color: theme.colors.subtext }}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.cardTitle, { marginTop: 10, color: theme.colors.subtext }]}>Favorite Colors</Text>
          <Text style={{ color: theme.colors.subtext }}>Black, Navy, White</Text>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            {[
              ['Tops', 'M'],
              ['Bottoms', '32'],
              ['Shoes', '9']
            ].map(([k, v]) => (
              <View
                key={k}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 12,
                  padding: 10,
                  alignItems: 'center',
                  backgroundColor: theme.colors.white
                }}
              >
                <Text style={{ color: theme.colors.text }}>{k}</Text>
                <Text style={{ fontWeight: '700', marginTop: 6, color: theme.colors.text }}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            marginTop: 18,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 10
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.colors.subtext} />
          <Text style={{ marginLeft: 6, color: theme.colors.text }}>Logout</Text>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stat: { flex: 1, borderRadius: 12, borderWidth: 1, alignItems: 'center', paddingVertical: 14 },
  statNum: { fontWeight: '800', marginTop: 6 },
  statLabel: { marginTop: 2 },
  card: { borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 12 },
  cardHeader: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  cardTitle: { fontSize: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
