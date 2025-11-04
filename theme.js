// theme.js
import React, { createContext, useContext } from 'react';

const THEME = {
  colors: {
    primary: '#6C63FF',
    primaryText: '#FFFFFF',
    text: '#0F172A',
    subtext: '#6B7280',
    border: '#E5E7EB',
    grayBG: '#F7F7FB',
    white: '#FFFFFF',
    tabIcon: '#9CA3AF',
    tabIconActive: '#6C63FF',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    xl: 28,
  },
  shadow: {
    soft: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
  },
};

const ThemeContext = createContext(THEME);

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={THEME}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
