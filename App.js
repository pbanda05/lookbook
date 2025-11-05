// App.js
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// screens
import ClosetScreen from './screens/ClosetScreen';
import GenerateScreen from './screens/GenerateScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import SavedScreen from './screens/SavedScreen'; // <- label is "Saved" now
import TrendsScreen from './screens/TrendsScreen';
import WelcomeScreen from './screens/WelcomeScreen';

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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
