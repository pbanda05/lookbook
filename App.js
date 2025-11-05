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
import ProfileScreen from './screens/ProfileScreen';
import SavedScreen from './screens/SavedScreen';
import TrendsScreen from './screens/TrendsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import WishListScreen from './screens/WishListScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          const name = route.name;
          // Restore “original” style icons (shirt, heart, trends, etc.)
          const iconMap = {
            Home: ['home-variant-outline', 'home-variant'],
            Closet: ['tshirt-crew-outline', 'tshirt-crew'],
            Generate: ['star-four-points-outline', 'star-four-points'],
            Help: ['help-circle-outline', 'help-circle'],
            WishList: ['heart-outline', 'heart'],
            Trends: ['trending-up', 'trending-up'],
            Profile: ['account-outline', 'account'],
          };
          const pair = iconMap[name] || ['circle-outline', 'circle'];
          const iconName = color === '#007AFF' ? pair[1] : pair[0];
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#7A7F87',
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Closet" component={ClosetScreen} />
      <Tabs.Screen name="Generate" component={GenerateScreen} />
      <Tabs.Screen name="Help" component={SavedScreen} />
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
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
