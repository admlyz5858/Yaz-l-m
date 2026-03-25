import { Stack } from 'expo-router';

import { Brand } from '@/constants/theme';

export default function MockExamLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: Brand.navy,
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="index" options={{ title: 'Zamanlı deneme' }} />
      <Stack.Screen name="session" options={{ title: 'Deneme', headerBackTitle: 'Geri' }} />
      <Stack.Screen name="result" options={{ title: 'Sonuç', headerLeft: () => null }} />
    </Stack>
  );
}
