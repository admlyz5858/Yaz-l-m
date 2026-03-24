import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand, BrandStrings } from '@/constants/theme';
import { MOCK_EXAM_PRESETS, useMockExamStore } from '@/store/mockExamStore';

function formatMin(sec: number) {
  const m = Math.floor(sec / 60);
  return `${m} dk`;
}

export default function MockExamHomeScreen() {
  const router = useRouter();
  const history = useMockExamStore((s) => s.history);
  const clearSession = useMockExamStore((s) => s.clearSession);
  const startPreset = useMockExamStore((s) => s.startPreset);

  const onStart = (presetId: string) => {
    const p = MOCK_EXAM_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    clearSession();
    startPreset(p);
    router.push('/mock-exam/session');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.kicker}>{BrandStrings.appNameFull}</Text>
      <Text style={styles.title}>Zamanlı deneme</Text>
      <Text style={styles.body}>
        Süre dolduğunda otomatik biter; cevaplar kaydedilir. İstersen erken bitirip sonucu görebilirsin.
      </Text>

      {MOCK_EXAM_PRESETS.map((p) => (
        <Pressable key={p.id} style={styles.card} onPress={() => onStart(p.id)}>
          <View style={styles.cardMain}>
            <Text style={styles.cardTitle}>{p.label}</Text>
            <Text style={styles.cardSub}>
              {p.questionCount} soru · {formatMin(p.durationSec)}
            </Text>
          </View>
          <Text style={styles.go}>Başlat</Text>
        </Pressable>
      ))}

      {history.length > 0 ? (
        <>
          <Text style={styles.section}>Son denemeler</Text>
          {history.slice(0, 5).map((h) => {
            const label = MOCK_EXAM_PRESETS.find((p) => p.id === h.presetId)?.label ?? h.presetId;
            return (
              <View key={h.id} style={styles.row}>
                <Text style={styles.rowTitle}>{label}</Text>
                <Text style={styles.rowSub}>
                  {h.correct}/{h.total} doğru · {formatMin(h.durationSec)}
                </Text>
              </View>
            );
          })}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: { fontSize: 12, fontWeight: '700', color: Brand.electricDim, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: Brand.navy, marginBottom: 8 },
  body: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12,
  },
  cardMain: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  cardSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  go: { fontSize: 15, fontWeight: '800', color: Brand.electricDim },
  section: { fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 10, color: Brand.navy },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  rowSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
