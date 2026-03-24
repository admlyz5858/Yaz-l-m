import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import Colors from '@/constants/Colors';
import { Brand } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useDashboardStore } from '@/store/dashboardStore';
import { useFlashcardStore } from '@/store/flashcardStore';
import { useOnboardingStore } from '@/store/onboardingStore';

/**
 * Alt navigasyon (PDF Bölüm 3.2): Ana Sayfa, Çalış, Sınav, İstatistik, Profil.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const incompleteTasks = useDashboardStore((s) => s.tasks.filter((t) => !t.done).length);
  const seedFlashcards = useFlashcardStore((s) => s.seedIfEmpty);
  const flashDue = useFlashcardStore((s) => s.getDueCountTotal());
  const profileIncomplete = useOnboardingStore((s) => !s.draft.fullName?.trim());

  useEffect(() => {
    seedFlashcards();
  }, [seedFlashcards]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: Brand.navy,
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => <DrawerToggleButton tintColor={Brand.navy} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarBadge: incompleteTasks > 0 ? incompleteTasks : undefined,
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Çalış',
          tabBarBadge: flashDue > 0 ? flashDue : undefined,
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
          tabBarBadge: profileIncomplete ? '!' : undefined,
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
