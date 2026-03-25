import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { useFlashcardStore } from '@/store/flashcardStore';

/**
 * PDF Bölüm 6.5 — Deste yönetimi (liste + bugün kalan).
 */
export default function FlashcardDecksScreen() {
  const seedIfEmpty = useFlashcardStore((s) => s.seedIfEmpty);
  const decks = useFlashcardStore((s) => s.decks);
  const getDueCountForDeck = useFlashcardStore((s) => s.getDueCountForDeck);
  const getDueCountTotal = useFlashcardStore((s) => s.getDueCountTotal);

  useFocusEffect(
    useCallback(() => {
      seedIfEmpty();
    }, [seedIfEmpty]),
  );

  const totalDue = getDueCountTotal();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Bugün tekrar</Text>
        <Text style={styles.summaryVal}>{totalDue} kart</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {decks.map((d) => {
          const due = getDueCountForDeck(d.deck_id);
          const total = d.kart_ids.length;
          return (
            <Link
              key={d.deck_id}
              href={{ pathname: '/flashcards/study', params: { deckId: d.deck_id } } as any}
              asChild>
              <Pressable style={styles.deckCard}>
                <View style={styles.deckIcon}>
                  <Ionicons name="albums-outline" size={26} color={Brand.purple} />
                </View>
                <View style={styles.deckBody}>
                  <Text style={styles.deckTitle}>{d.başlık}</Text>
                  <Text style={styles.deckMeta}>
                    {d.sınav_etiketi} · {total} kart
                  </Text>
                  <Text style={styles.deckDue}>Bugün kalan: {due}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
              </Pressable>
            </Link>
          );
        })}

        <View style={styles.stub}>
          <Text style={styles.stubTitle}>AI ile deste üret</Text>
          <Text style={styles.stubText}>
            PDF, ses, URL ve soru bankasından kart üretimi bir sonraki sürümde.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  summary: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: 'rgba(168,85,247,0.12)',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 14, color: '#6b21a8', fontWeight: '600' },
  summaryVal: { fontSize: 20, fontWeight: '800', color: Brand.navy },
  scroll: { padding: 16, paddingBottom: 40 },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  deckIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(168,85,247,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckBody: { flex: 1 },
  deckTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  deckMeta: { fontSize: 13, color: '#64748b', marginTop: 4 },
  deckDue: { fontSize: 13, color: Brand.purple, fontWeight: '600', marginTop: 6 },
  stub: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
  },
  stubTitle: { fontSize: 15, fontWeight: '700', color: '#475569', marginBottom: 8 },
  stubText: { fontSize: 13, color: '#94a3b8', lineHeight: 18 },
});
