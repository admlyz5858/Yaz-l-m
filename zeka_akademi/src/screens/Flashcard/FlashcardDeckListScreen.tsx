/**
 * Flash Kart — Deste Yönetimi
 * Destelerim: grid/liste, kart sayısı, son çalışma, bugün kalan
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SAMPLE_DECKS = [
  { id: '1', name: 'Matematik - Türev', cardCount: 24, lastStudy: 'Dün', dueToday: 8 },
  { id: '2', name: 'Türkçe - Paragraf', cardCount: 18, lastStudy: '2 gün önce', dueToday: 12 },
  { id: '3', name: 'Fen - Kimya', cardCount: 15, lastStudy: 'Hiç', dueToday: 15 },
];

interface FlashcardDeckListScreenProps {
  navigation?: any;
}

export default function FlashcardDeckListScreen({ navigation }: FlashcardDeckListScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a237e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flash Kart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {SAMPLE_DECKS.map((deck) => (
          <TouchableOpacity
            key={deck.id}
            style={styles.deckCard}
            onPress={() => navigation?.navigate('FlashcardStudy', { deckId: deck.id, deckName: deck.name })}
          >
            <View style={styles.deckIcon}>
              <MaterialCommunityIcons name="cards" size={28} color="#7c4dff" />
            </View>
            <View style={styles.deckContent}>
              <Text style={styles.deckName}>{deck.name}</Text>
              <Text style={styles.deckMeta}>
                {deck.cardCount} kart • Son: {deck.lastStudy}
              </Text>
              {deck.dueToday > 0 && (
                <Text style={styles.dueBadge}>Bugün {deck.dueToday} kart</Text>
              )}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addDeck}>
          <MaterialCommunityIcons name="plus-circle-outline" size={32} color="#7c4dff" />
          <Text style={styles.addDeckText}>Yeni Deste Oluştur</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a237e' },
  scroll: { padding: 16, paddingBottom: 32 },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  deckIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deckContent: { flex: 1 },
  deckName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  deckMeta: { fontSize: 13, color: '#666', marginTop: 4 },
  dueBadge: {
    fontSize: 12,
    color: '#7c4dff',
    marginTop: 4,
    fontWeight: '500',
  },
  addDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addDeckText: { fontSize: 16, color: '#7c4dff', fontWeight: '500' },
});
