import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// contexts
import { ClosetProvider } from './context/ClosetContext';
import { WishlistProvider } from './context/WishlistContext';

// screens
import AddItemScreen from './screens/AddItemScreen.js';
import ClosetScreen from './screens/ClosetScreen.js';
import GenerateScreen from './screens/GenerateScreen.js';
import HomeScreen from './screens/HomeScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import SavedScreen from './screens/SavedScreen.js';
import SearchItemScreen from './screens/SearchItemScreen.js';
import TrendsScreen from './screens/TrendsScreen.js';
import WelcomeScreen from './screens/WelcomeScreen.js';
import WishListScreen from './screens/WishListScreen.js'; // <- exact case + .js

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#7A7F87',
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: ['home-variant-outline', 'home-variant'],
            Closet: ['tshirt-crew-outline', 'tshirt-crew'],
            Generate: ['star-four-points-outline', 'star-four-points'],
            Saved: ['bookmark-outline', 'bookmark'],          // <- not “Help”
            WishList: ['heart-outline', 'heart'],
            Trends: ['trending-up', 'trending-up'],
            Profile: ['account-outline', 'account'],
          };
          const pair = iconMap[route.name] || ['circle-outline', 'circle'];
          const name = color === '#007AFF' ? pair[1] : pair[0];
          return <MaterialCommunityIcons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Closet" component={ClosetScreen} />
      <Tabs.Screen name="Generate" component={GenerateScreen} />
      <Tabs.Screen name="Saved" component={SavedScreen} />
      <Tabs.Screen name="WishList" component={WishListScreen} />
      <Tabs.Screen name="Trends" component={TrendsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ClosetProvider>
        <WishlistProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="AddItem" component={AddItemScreen} />
              <Stack.Screen name="SearchItem" component={SearchItemScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </WishlistProvider>
      </ClosetProvider>
    </SafeAreaProvider>
  );
}
