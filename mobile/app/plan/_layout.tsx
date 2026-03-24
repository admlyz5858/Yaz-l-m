import { Stack } from 'expo-router';

export default function PlanStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Geri',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="index" options={{ title: 'Çalışma planı' }} />
      <Stack.Screen name="analysis" options={{ title: 'Plan analizi' }} />
    </Stack>
  );
}
