// navigation/RootNavigator.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ClosetScreen from '../screens/ClosetScreen';
import GenerateScreen from '../screens/GenerateScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SavedScreen from '../screens/SavedScreen';
import TrendsScreen from '../screens/TrendsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import WishlistScreen from '../screens/WishlistScreen';

import { useTheme } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const theme = useTheme();

  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: theme.colors.tabIconActive,
    tabBarInactiveTintColor: theme.colors.tabIcon,
    tabBarStyle: {
      backgroundColor: theme.colors.white,
      borderTopColor: theme.colors.border,
      height: 64,
      paddingTop: 6,
      paddingBottom: 8,
    },
    tabBarIcon: ({ color, focused }) => {
      let name = 'ellipse-outline';
      switch (route.name) {
        case 'Home': name = focused ? 'home' : 'home-outline'; break;
        case 'Closet': name = focused ? 'shirt' : 'shirt-outline'; break;
        case 'Generate': name = focused ? 'sparkles' : 'sparkles-outline'; break;
        case 'Wishlist': name = focused ? 'help-circle' : 'help-circle-outline'; break;
        case 'Saved': name = focused ? 'heart' : 'heart-outline'; break;
        case 'Trends':
          // If your Ionicons set lacks 'trending-up', use 'stats-chart' instead.
          name = focused ? 'trending-up' : 'trending-up-outline';
          break;
        case 'Profile': name = focused ? 'person' : 'person-outline'; break;
      }
      return <Ionicons name={name} size={26} color={color} />;
    },
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Closet" component={ClosetScreen} />
      <Tab.Screen name="Generate" component={GenerateScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Trends" component={TrendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
