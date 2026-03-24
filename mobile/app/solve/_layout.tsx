import { Stack } from 'expo-router';

export default function SolveLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Geri',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="index" options={{ title: 'AI Soru Çöz' }} />
      <Stack.Screen name="result" options={{ title: 'Çözüm' }} />
    </Stack>
  );
}
