import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

/**
 * Sınav sekmesi: deneme, soru bankası, yarışma (PDF Bölüm 3.2).
 */
export default function ExamTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sınav</Text>
      <Text style={styles.body}>Deneme ve yarışma yakında; soru bankası hazır.</Text>
      <Link href="/question-bank" asChild>
        <Pressable style={styles.card}>
          <Ionicons name="library-outline" size={24} color={Brand.purple} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Soru bankası</Text>
            <Text style={styles.cardSub}>Filtrele, çöz, ilerleme kaydı</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </Pressable>
      </Link>
      <View style={[styles.card, styles.muted]}>
        <Ionicons name="timer-outline" size={24} color="#94a3b8" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Zamanlı deneme</Text>
          <Text style={styles.cardSub}>Yakında</Text>
        </View>
      </View>
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
  muted: { opacity: 0.85 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
