/**
 * LadeK Academy - Ana Navigator
 * Splash → Welcome → Auth → Onboarding → Main
 */
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import SplashScreenComponent from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import ProfileStep1Screen from '../screens/onboarding/ProfileStep1Screen';
import ExamSelectScreen from '../screens/onboarding/ExamSelectScreen';
import LevelTestScreen from '../screens/onboarding/LevelTestScreen';
import PlanCreateScreen from '../screens/onboarding/PlanCreateScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const handleSplashFinish = (hasToken: boolean) => {
    if (hasToken) {
      setInitialRoute('Main');
    } else {
      setInitialRoute('Welcome');
    }
    setAppReady(true);
  };

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady || !initialRoute) {
    return (
      <SplashScreenComponent onFinish={handleSplashFinish} />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreenWrapper} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ProfileStep1" component={ProfileStep1Screen} />
        <Stack.Screen name="ExamSelect" component={ExamSelectScreen} />
        <Stack.Screen name="LevelTest" component={LevelTestScreen} />
        <Stack.Screen name="PlanCreate" component={PlanCreateScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function WelcomeScreenWrapper({ navigation }: any) {
  return (
    <WelcomeScreen
      onSignUp={() => navigation.navigate('Auth', { mode: 'signup' })}
      onSignIn={() => navigation.navigate('Auth', { mode: 'signin' })}
    />
  );
}
