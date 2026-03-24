/**
 * Çalış ana ekranı: AI Soru Çöz, Flash Kart, Pomodoro
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StudyHomeScreenProps {
  navigation?: any;
}

const ITEMS = [
  { id: 'ai-solve', label: 'AI Soru Çöz', icon: 'camera' as const, screen: 'AISolveEntry' as const, ready: true },
  { id: 'flashcard', label: 'Flash Kart', icon: 'cards' as const, screen: 'FlashcardDeckList' as const, ready: true },
  { id: 'pomodoro', label: 'Pomodoro', icon: 'timer-sand' as const, screen: 'Pomodoro' as const, ready: true },
];

export default function StudyHomeScreen({ navigation }: StudyHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Çalış</Text>
        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, !item.ready && styles.cardDisabled]}
            onPress={() => item.screen && navigation?.navigate(item.screen)}
            disabled={!item.ready}
          >
            <MaterialCommunityIcons name={item.icon} size={40} color="#0d9488" />
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardDesc}>
                {item.ready ? 'Başla' : 'Yakında'}
              </Text>
            </View>
            {item.ready && (
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa' },
  scroll: { padding: 16, paddingTop: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  cardDisabled: { opacity: 0.6 },
  cardContent: { flex: 1, marginLeft: 16 },
  cardLabel: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 4 },
});
