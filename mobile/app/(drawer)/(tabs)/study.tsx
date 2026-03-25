import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useFlashcardStore } from '@/store/flashcardStore';

const CARDS = [
  { title: 'AI Soru Çöz', subtitle: 'Metin + stub çözüm', href: '/solve', soon: false },
  { title: 'Flash Kart', subtitle: 'FSRS tekrar', href: '/flashcards', soon: false },
  { title: 'Pomodoro', subtitle: 'Odaklanma', href: '/pomodoro', soon: false },
  {
    title: 'AI Plan',
    subtitle: 'Haftalık çalışma',
    href: '/plan',
    soon: false,
  },
] as const;

/**
 * Çalış sekmesi: soru çözme, flash kart, Pomodoro + plan (PDF Bölüm 3.2 / 4).
 */
export default function StudyTabScreen() {
  const seedIfEmpty = useFlashcardStore((s) => s.seedIfEmpty);
  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Çalış</Text>
      <Text style={styles.body}>Modüller buradan açılır; AI plan hazır.</Text>
      {CARDS.map((c) =>
        c.soon ? (
          <View key={c.title} style={[styles.card, styles.cardMuted]}>
            <Ionicons name="construct-outline" size={22} color="#94a3b8" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardSub}>{c.subtitle} — yakında</Text>
            </View>
          </View>
        ) : (
          <Link key={c.title} href={c.href as any} asChild>
            <Pressable style={styles.card}>
              <Ionicons
                name={
                  c.title === 'Flash Kart'
                    ? 'albums-outline'
                    : c.title === 'Pomodoro'
                      ? 'timer-outline'
                      : c.title === 'AI Soru Çöz'
                        ? 'bulb-outline'
                        : 'calendar-outline'
                }
                size={22}
                color={Brand.electricDim}
              />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardSub}>{c.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </Pressable>
          </Link>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  cardMuted: { opacity: 0.85 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
