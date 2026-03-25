import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { QUESTION_BANK } from '@/data/questionBank';
import { MOCK_EXAM_PRESETS, useMockExamStore } from '@/store/mockExamStore';

export default function MockExamResultScreen() {
  const router = useRouter();
  const presetId = useMockExamStore((s) => s.presetId);
  const questionIds = useMockExamStore((s) => s.questionIds);
  const answers = useMockExamStore((s) => s.answers);
  const finishedAt = useMockExamStore((s) => s.finishedAt);
  const clearSession = useMockExamStore((s) => s.clearSession);

  const summary = useMemo(() => {
    let correct = 0;
    for (const id of questionIds) {
      const q = QUESTION_BANK.find((x) => x.question_id === id);
      const a = answers[id];
      if (q && q.doğru_index !== undefined && a === q.doğru_index) correct += 1;
    }
    return { correct, total: questionIds.length };
  }, [questionIds, answers]);

  const label = MOCK_EXAM_PRESETS.find((p) => p.id === presetId)?.label ?? 'Deneme';

  const onDone = () => {
    clearSession();
    router.replace('/(drawer)/(tabs)/exam');
  };

  if (!finishedAt && questionIds.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.empty}>Sonuç bulunamadı.</Text>
        <Pressable style={styles.primary} onPress={() => router.replace('/mock-exam')}>
          <Text style={styles.primaryText}>Denemelere dön</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const pct = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.score}>
        {summary.correct} / {summary.total}
      </Text>
      <Text style={styles.pct}>Başarı oranı %{pct}</Text>

      <Text style={styles.section}>Özet</Text>
      {questionIds.map((id) => {
        const q = QUESTION_BANK.find((x) => x.question_id === id);
        if (!q || q.doğru_index === undefined) return null;
        const a = answers[id];
        const ok = a === q.doğru_index;
        return (
          <View key={id} style={styles.reviewRow}>
            <Text style={[styles.dot, { color: ok ? Brand.success : Brand.danger }]}>●</Text>
            <Text style={styles.reviewText} numberOfLines={2}>
              {q.metin}
            </Text>
          </View>
        );
      })}

      <Pressable style={styles.primary} onPress={onDone}>
        <Text style={styles.primaryText}>Tamam</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => router.replace('/mock-exam')}>
        <Text style={styles.secondaryText}>Yeni deneme</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },
  label: { fontSize: 14, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  score: { fontSize: 40, fontWeight: '800', color: Brand.navy },
  pct: { fontSize: 18, fontWeight: '600', color: Brand.electricDim, marginTop: 4, marginBottom: 24 },
  section: { fontSize: 16, fontWeight: '800', color: Brand.navy, marginBottom: 12 },
  reviewRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  dot: { fontSize: 12, marginTop: 4 },
  reviewText: { flex: 1, fontSize: 14, color: '#475569', lineHeight: 20 },
  primary: {
    marginTop: 28,
    backgroundColor: Brand.navy,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondary: { marginTop: 12, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: Brand.electricDim, fontWeight: '700', fontSize: 15 },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 40 },
});
