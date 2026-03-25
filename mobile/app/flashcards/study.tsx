import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { formatDueLabel } from '@/lib/fsrsLite';
import type { FsrsRating } from '@/lib/fsrsLite';
import { useFlashcardStore } from '@/store/flashcardStore';

const RATING_LABELS: Record<FsrsRating, string> = {
  1: 'Yeniden',
  2: 'Zor',
  3: 'Orta',
  4: 'Kolay',
  5: 'Çok kolay',
};

const RATING_COLORS: Record<FsrsRating, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#15803d',
};

/**
 * PDF Bölüm 6.4 — Flash kart çalışma (flip + 5 derece).
 */
export default function FlashcardStudyScreen() {
  const { deckId } = useLocalSearchParams<{ deckId?: string }>();
  const router = useRouter();
  const getStudyQueue = useFlashcardStore((s) => s.getStudyQueue);
  const rateCard = useFlashcardStore((s) => s.rateCard);
  const decks = useFlashcardStore((s) => s.decks);

  const queue = useMemo(() => (deckId ? getStudyQueue(deckId) : []), [deckId, getStudyQueue]);
  const deckTitle = decks.find((d) => d.deck_id === deckId)?.başlık ?? 'Deste';

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [deckId]);

  const current = queue[index];
  const total = queue.length;

  const onRate = (r: FsrsRating) => {
    if (!current) return;
    rateCard(current.id, r);
    setFlipped(false);
    if (index + 1 < queue.length) {
      setIndex(index + 1);
    } else {
      router.back();
    }
  };

  if (!deckId || total === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.empty}>Bugün bu deste için tekrar bekleyen kart yok.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Geri dön</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const estMin = Math.max(1, Math.ceil((total - index) * 0.5));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.deckName}>{deckTitle}</Text>
        <Text style={styles.progress}>
          Kart {index + 1} / {total}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((index + 1) / total) * 100}%` }]} />
        </View>
      </View>

      <Pressable style={styles.cardArea} onPress={() => setFlipped(!flipped)}>
        <View style={styles.cardFace}>
          {flipped ? (
            <>
              <Text style={styles.cardLabel}>Arka</Text>
              <Text style={styles.cardText}>{current.arka}</Text>
              {current.kaynak ? <Text style={styles.kaynak}>Kaynak: {current.kaynak}</Text> : null}
            </>
          ) : (
            <>
              <Text style={styles.cardLabel}>Ön</Text>
              <Text style={styles.cardText}>{current.ön}</Text>
            </>
          )}
        </View>
        <Text style={styles.tapHint}>Dokunarak çevir · FSRS tekrar</Text>
      </Pressable>

      <Text style={styles.footerEta}>Tahmini süre: ~{estMin} dk · {formatDueLabel(current.schedule)}</Text>

      <View style={styles.ratingRow}>
        {([1, 2, 3, 4, 5] as FsrsRating[]).map((r) => (
          <Pressable
            key={r}
            style={[styles.rateBtn, { borderColor: RATING_COLORS[r] }]}
            onPress={() => onRate(r)}>
            <Text style={[styles.rateNum, { color: RATING_COLORS[r] }]}>{r}</Text>
            <Text style={styles.rateLabel}>{RATING_LABELS[r]}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16 },
  header: { marginBottom: 12 },
  deckName: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  progress: { fontSize: 16, fontWeight: '800', color: Brand.navy, marginTop: 4 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Brand.purple },
  cardArea: { flex: 1, justifyContent: 'center', minHeight: 280 },
  cardFace: {
    minHeight: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase' },
  cardText: { fontSize: 17, lineHeight: 26, color: '#0f172a', fontWeight: '500' },
  kaynak: { marginTop: 16, fontSize: 12, color: '#64748b' },
  tapHint: { textAlign: 'center', marginTop: 12, fontSize: 12, color: '#94a3b8' },
  footerEta: { textAlign: 'center', fontSize: 13, color: '#64748b', marginBottom: 12 },
  ratingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
    paddingBottom: 24,
  },
  rateBtn: {
    width: '18%',
    minWidth: 58,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rateNum: { fontSize: 16, fontWeight: '800' },
  rateLabel: { fontSize: 9, color: '#64748b', marginTop: 2, textAlign: 'center' },
  empty: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 40 },
  back: { textAlign: 'center', marginTop: 16, color: Brand.purple, fontWeight: '700' },
});
