import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

export default function PrimaryButton({ title = 'Generate', onPress, style }) {
  const theme = useTheme() || { colors: {} };

  const PRIMARY = theme.colors.primary ?? '#6D5EF5';
  const TXT = theme.colors.primaryText ?? '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.btn,
        { backgroundColor: PRIMARY },
        theme.shadow?.soft,
        style,
      ]}
    >
      <Text style={[styles.txt, { color: TXT }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 14,
    fontWeight: '700',
  },
});

