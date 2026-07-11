import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View, ActivityIndicator } from 'react-native';
import { supabase } from './src/lib/supabase';
import { initPurchases, getSubscriptionStatus } from './src/lib/purchases';
import PaywallScreen from './src/screens/PaywallScreen';

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
import QuickRefillScreen from './src/screens/QuickRefillScreen';
import JournalScreen from './src/screens/JournalScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
  Home: '🏠',
  Goals: '🎯',
  Reset: '☕',
  Pet: '🐹',
  Journal: '📖',
  Profile: '🏅',
};

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      sceneContainerStyle={{ paddingTop: insets.top }}
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
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
          height: 58 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Reset" component={QuickRefillScreen} />
      <Tab.Screen name="Pet" component={PetScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  const [screen, setScreen] = useState('SignIn');
  if (screen === 'SignIn') {
    return <SignInScreen onNavigateToSignUp={() => setScreen('SignUp')} />;
  }
  return <SignUpScreen onNavigateToSignIn={() => setScreen('SignIn')} />;
}

export default function App() {
  const [session, setSession]       = useState(undefined); // undefined = loading
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        initPurchases(session.user.id);
        getSubscriptionStatus().then(({ isActive }) => setIsSubscribed(isActive));
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        initPurchases(session.user.id);
        getSubscriptionStatus().then(({ isActive }) => setIsSubscribed(isActive));
      } else {
        setIsSubscribed(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F0EA' }}>
        <Text style={{ fontSize: 56, marginBottom: 20 }}>🐹</Text>
        <ActivityIndicator size="large" color="#7B9E87" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        {session ? (
          isSubscribed ? (
            <AppProvider userId={session.user.id} user={session.user}>
              <NavigationContainer>
                <MainTabs />
              </NavigationContainer>
            </AppProvider>
          ) : (
            <PaywallScreen onSubscribed={() => setIsSubscribed(true)} />
          )
        ) : (
          <AuthStack />
        )}
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
