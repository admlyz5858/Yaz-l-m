/**
 * Sınav sekmesi: Deneme, Soru Bankası, Yarışma
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExamHomeScreen from '../screens/Exam/ExamHomeScreen';
import TrialExamSelectScreen from '../screens/Exam/TrialExamSelectScreen';
import TrialExamRunScreen from '../screens/Exam/TrialExamRunScreen';
import TrialExamResultScreen from '../screens/Exam/TrialExamResultScreen';
import QuestionBankScreen from '../screens/Question/QuestionBankScreen';
import QuestionSolveScreen from '../screens/Question/QuestionSolveScreen';

const Stack = createNativeStackNavigator();

export default function ExamStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExamHome" component={ExamHomeScreen} />
      <Stack.Screen name="TrialExamSelect" component={TrialExamSelectScreen} />
      <Stack.Screen name="TrialExamRun" component={TrialExamRunScreen} />
      <Stack.Screen name="TrialExamResult" component={TrialExamResultScreen} />
      <Stack.Screen name="QuestionBank" component={QuestionBankScreen} />
      <Stack.Screen name="QuestionSolve" component={QuestionSolveScreen} />
    </Stack.Navigator>
  );
}
