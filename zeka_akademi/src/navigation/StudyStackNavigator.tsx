/**
 * Çalış sekmesi: AI Soru Çöz, Flash Kart, Pomodoro
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudyHomeScreen from '../screens/Study/StudyHomeScreen';
import AISolveEntryScreen from '../screens/Question/AISolveEntryScreen';
import AISolutionScreen from '../screens/Question/AISolutionScreen';
import FlashcardDeckListScreen from '../screens/Flashcard/FlashcardDeckListScreen';
import FlashcardStudyScreen from '../screens/Flashcard/FlashcardStudyScreen';

const Stack = createNativeStackNavigator();

export default function StudyStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudyHome" component={StudyHomeScreen} />
      <Stack.Screen name="AISolveEntry" component={AISolveEntryScreen} />
      <Stack.Screen name="AISolution" component={AISolutionScreen} />
      <Stack.Screen name="FlashcardDeckList" component={FlashcardDeckListScreen} />
      <Stack.Screen name="FlashcardStudy" component={FlashcardStudyScreen} />
    </Stack.Navigator>
  );
}
