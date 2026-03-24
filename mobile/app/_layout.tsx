import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Arka planda yükle; asla `return null` ile ağacı bloklama — release APK’da boş ekran yapıyordu.
  const [, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const hide = () => {
      void SplashScreen.hideAsync();
    };
    const interaction = InteractionManager.runAfterInteractions(hide);
    const fallback = setTimeout(hide, 2500);
    return () => {
      interaction.cancel();
      clearTimeout(fallback);
    };
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth" options={{ headerShown: true, title: 'Giriş / Kayıt' }} />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="plan" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Bilgi' }} />
      </Stack>
    </ThemeProvider>
  );
}
