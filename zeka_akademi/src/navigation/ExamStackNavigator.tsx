/**
 * Sınav sekmesi: Deneme, Soru Bankası, Yarışma
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExamHomeScreen from '../screens/Exam/ExamHomeScreen';
import QuestionBankScreen from '../screens/Question/QuestionBankScreen';
import QuestionSolveScreen from '../screens/Question/QuestionSolveScreen';

const Stack = createNativeStackNavigator();

export default function ExamStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExamHome" component={ExamHomeScreen} />
      <Stack.Screen name="QuestionBank" component={QuestionBankScreen} />
      <Stack.Screen name="QuestionSolve" component={QuestionSolveScreen} />
    </Stack.Navigator>
  );
}
