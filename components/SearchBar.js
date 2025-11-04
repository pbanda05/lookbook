import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../theme';

export default function SearchBar({ placeholder='Search', value, onChangeText }) {
  const theme = useTheme() || { colors: {}, radius: {} };

  return (
    <View 
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.grayBG,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg ?? 16,
        }
      ]}
    >
      <Ionicons name="search" size={18} color={theme.colors.subtext}/>
      
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: theme.colors.text }]}
        placeholderTextColor={theme.colors.subtext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{
    flexDirection:'row',
    alignItems:'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
  },
  input:{
    flex: 1,
    fontSize: 14,
  },
});
