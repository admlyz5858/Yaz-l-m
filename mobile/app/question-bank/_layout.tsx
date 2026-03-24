import { Stack } from 'expo-router';

export default function QuestionBankLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Geri',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="index" options={{ title: 'Soru bankası' }} />
      <Stack.Screen name="practice" options={{ title: 'Soru çöz' }} />
    </Stack>
  );
}
