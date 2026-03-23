import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Geri',
        title: 'Profil Kurulumu',
      }}>
      <Stack.Screen name="profile" options={{ title: 'Adım 1/4' }} />
      <Stack.Screen name="exams" options={{ title: 'Adım 2/4' }} />
      <Stack.Screen name="assessment" options={{ title: 'Adım 3/4' }} />
      <Stack.Screen name="plan" options={{ title: 'Adım 4/4' }} />
    </Stack>
  );
}
