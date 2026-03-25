import { Stack } from 'expo-router';

export default function FlashcardsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Geri',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="index" options={{ title: 'Flash kartlar' }} />
      <Stack.Screen name="study" options={{ title: 'Çalışma' }} />
    </Stack>
  );
}
