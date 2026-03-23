/**
 * Bottom Navigation - 5 tab: Ana Sayfa, Çalış, Sınav, İstatistik, Profil
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        options={{ tabBarLabel: 'Ana Sayfa', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Study"
        component={() => <PlaceholderScreen name="Çalış" />}
        options={{ tabBarLabel: 'Çalış', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="book-open" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Exam"
        component={() => <PlaceholderScreen name="Sınav" />}
        options={{ tabBarLabel: 'Sınav', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Stats"
        component={() => <PlaceholderScreen name="İstatistik" />}
        options={{ tabBarLabel: 'İstatistik', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen name="Profil" />}
        options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
