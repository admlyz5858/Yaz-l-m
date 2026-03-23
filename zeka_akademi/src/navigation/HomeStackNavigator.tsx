/**
 * Ana Sayfa stack: Dashboard, Plan Görünümü, Plan Analizi
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/Main/DashboardScreen';
import PlanViewScreen from '../screens/Plan/PlanViewScreen';
import PlanAnalysisScreen from '../screens/Plan/PlanAnalysisScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="PlanView" component={PlanViewScreen} />
      <Stack.Screen name="PlanAnalysis" component={PlanAnalysisScreen} />
    </Stack.Navigator>
  );
}
