import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboardingStore';

/**
 * Ana panel özeti (PDF Bölüm 3.1) — ilk sürüm: yer tutucu bileşenler.
 */
export default function HomeScreen() {
  const draft = useOnboardingStore((s) => s.draft);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.greeting}>Günaydın{draft.fullName ? `, ${draft.fullName.split(' ')[0]}` : ''}!</Text>

      <View style={styles.row}>
        <View style={styles.goalPill}>
          <Text style={styles.goalLabel}>Bugünkü hedef</Text>
          <Text style={styles.goalPct}>%0</Text>
        </View>
        <Text style={styles.streak}>🔥 0 gün seri</Text>
      </View>

      <View style={styles.countdownCard}>
        <Text style={styles.countdownTitle}>Sınav geri sayım</Text>
        <Text style={styles.countdownBig}>Takvim modülü ile güncellenecek</Text>
        <Text style={styles.countdownSub}>Hedef sınav: {draft.examTypes.join(', ') || 'Seçilmedi'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Bugünkü görevler</Text>
      <View style={styles.task}>
        <Text style={styles.taskText}>AI plan bağlandığında görevler listelenecek.</Text>
      </View>

      <Text style={styles.sectionTitle}>Hızlı erişim</Text>
      <View style={styles.grid}>
        {['AI Soru Çöz', 'Flash Kart', 'Deneme', 'AI Plan', 'Soru Bankası', 'Yarışma'].map((label) => (
          <View key={label} style={styles.gridItem}>
            <Text style={styles.gridText}>{label}</Text>
          </View>
        ))}
      </View>

      <Link href="/modal" asChild>
        <Pressable style={styles.linkBtn}>
          <Text style={styles.linkText}>Uygulama bilgisi</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 22, fontWeight: '800', color: Brand.navy, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  goalPill: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  goalLabel: { fontSize: 12, color: '#64748b' },
  goalPct: { fontSize: 18, fontWeight: '800', color: Brand.navy },
  streak: { fontSize: 14, fontWeight: '600', color: '#ea580c' },
  countdownCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  countdownTitle: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  countdownBig: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  countdownSub: { fontSize: 13, color: '#64748b', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  task: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  taskText: { fontSize: 14, color: '#475569' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  gridItem: {
    width: '31%',
    minWidth: 100,
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  gridText: { fontSize: 12, fontWeight: '600', color: '#334155', textAlign: 'center' },
  linkBtn: { alignSelf: 'flex-start' },
  linkText: { color: Brand.purple, fontWeight: '600', fontSize: 15 },
});
