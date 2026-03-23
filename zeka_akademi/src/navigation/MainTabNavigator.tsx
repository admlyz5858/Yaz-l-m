/**
 * Bottom Navigation - 5 tab: Ana Sayfa, Çalış, Sınav, İstatistik, Profil
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import DashboardScreen from '../screens/Main/DashboardScreen';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} (Yakında)</Text>
  </View>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c4dff',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Ana Sayfa', tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tab.Screen
        name="Study"
        component={() => <PlaceholderScreen name="Çalış" />}
        options={{ tabBarLabel: 'Çalış', tabBarIcon: () => <Text>📖</Text> }}
      />
      <Tab.Screen
        name="Exam"
        component={() => <PlaceholderScreen name="Sınav" />}
        options={{ tabBarLabel: 'Sınav', tabBarIcon: () => <Text>📝</Text> }}
      />
      <Tab.Screen
        name="Stats"
        component={() => <PlaceholderScreen name="İstatistik" />}
        options={{ tabBarLabel: 'İstatistik', tabBarIcon: () => <Text>📊</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen name="Profil" />}
        options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text>👤</Text> }}
      />
    </Tab.Navigator>
  );
}
