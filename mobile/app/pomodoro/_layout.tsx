import { Stack } from 'expo-router';

export default function PomodoroLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Geri',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="index" options={{ title: 'Pomodoro' }} />
    </Stack>
  );
}
