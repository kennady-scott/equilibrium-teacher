import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#C62828', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ fontSize: 13, color: '#555', fontFamily: 'monospace' }}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import PetScreen from './src/screens/PetScreen';
import JournalScreen from './src/screens/JournalScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: '🏠',
  Goals: '🎯',
  Pet: '🐹',
  Journal: '📖',
  Profile: '🏅',
};

export default function App() {
  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused }) => (
                <Text style={{ fontSize: focused ? 24 : 20 }}>{ICONS[route.name]}</Text>
              ),
              tabBarLabel: route.name,
              tabBarActiveTintColor: '#7B9E87',
              tabBarInactiveTintColor: '#AAAAAA',
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopColor: '#F0EDE8',
                paddingBottom: 6,
                paddingTop: 6,
                height: 64,
              },
              tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Goals" component={GoalsScreen} />
            <Tab.Screen name="Pet" component={PetScreen} />
            <Tab.Screen name="Journal" component={JournalScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
