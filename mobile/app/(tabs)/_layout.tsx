import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

/**
 * Alt navigasyon (PDF Bölüm 3.2): Ana Sayfa, Çalış, Sınav, İstatistik, Profil.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarBadge: undefined,
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Çalış',
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: 'Sınav',
          tabBarIcon: ({ color }) => <Ionicons name="create-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'İstatistik',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
