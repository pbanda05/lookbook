import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useTheme } from '../theme';

function TrendCard({ title, theme }) {
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.grayBG,
        borderColor: theme.colors.primary
      }
    ]}>
      <Text style={{ color: theme.colors.text, textAlign: 'center' }}>{title}</Text>
    </View>
  );
}

export default function TrendsScreen() {
  const theme = useTheme();

  return (
    <SafeScreen scroll>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Trends</Text>

        <View style={styles.categoryRow}>
          {['All','Tops','Bottoms','Shoes','Accessories'].map((c, i) => (
            <View
              key={i}
              style={[
                styles.chip,
                {
                  backgroundColor: theme.colors.white,
                  borderColor: i === 0 ? theme.colors.primary : theme.colors.border,
                  shadowColor: i === 0 ? theme.colors.primary : 'transparent',
                  shadowOpacity: i === 0 ? 0.1 : 0,
                  shadowRadius: i === 0 ? 6 : 0,
                }
              ]}
            >
              <Text style={{ color: i === 0 ? theme.colors.primary : theme.colors.text }}>{c}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.section, { color: theme.colors.text }]}>Trending Now</Text>

        <View style={styles.grid}>
          {[
            'Mocha Mousse Leather Biker Jacket',
            'Faded Terracotta Wide-Leg Trousers',
            'Suede Ankle Boots in Sand',
            'Rimless Gradient-Tinted Sunglasses',
          ].map((t, i) => <TrendCard key={i} title={t} theme={theme} />)}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignSelf: 'center', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', gap: 10, marginVertical: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  section: { fontWeight: '800', fontSize: 18, textAlign: 'center', marginVertical: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', height: 140, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});
