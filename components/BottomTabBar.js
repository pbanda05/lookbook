import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme'; // ✅ correct import

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() || { colors: {} }; // ✅ fallback

  const active = theme.colors.primary || "#6C63FF";
  const inactive = theme.colors.tabIcon || "#999";
  const bg = theme.colors.white || "#FFF";
  const border = theme.colors.border || "#E5E7EB";

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: BG, borderTopColor: BORDER }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const label =
            descriptors[route.key]?.options?.tabBarLabel ??
            descriptors[route.key]?.options?.title ??
            route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab} accessibilityRole="button" accessibilityState={isFocused ? { selected: true } : {}}>
              <Text style={[styles.label, { color: isFocused ? ACTIVE : INACTIVE }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
