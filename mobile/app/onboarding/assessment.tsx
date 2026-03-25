import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

/**
 * Ekran 6 — Seviye tespiti Step 3/4 (PDF Bölüm 2.6). MVP: yer tutucu; sonraki iterasyonda 10 soru + adaptif.
 */
export default function AssessmentStepScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hızlı tanıma testi</Text>
      <Text style={styles.body}>
        10 soru, soru başına 60 saniye ve adaptif zorluk bir sonraki sürümde eklenecek. Şimdilik
        varsayılan başlangıç seviyesi atanacak.
      </Text>
      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={styles.progressText}>Adım 3 / 4</Text>
      </View>
      <Pressable style={styles.primary} onPress={() => router.push('/onboarding/plan')}>
        <Text style={styles.primaryText}>Devam Et</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/onboarding/plan')}>
        <Text style={styles.skip}>Atla (varsayılan seviye)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  body: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 24 },
  progress: { marginBottom: 24 },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Brand.purple },
  progressText: { marginTop: 8, fontSize: 12, color: '#64748b', textAlign: 'right' },
  primary: {
    backgroundColor: Brand.navy,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  skip: { textAlign: 'center', color: Brand.purple, fontWeight: '600', fontSize: 15 },
});
