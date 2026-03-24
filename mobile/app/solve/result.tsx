import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { generateStubSolution } from '@/lib/aiSolveStub';

/**
 * PDF Bölüm 5.1.3 — Çözüm ekranı (stub motor).
 */
export default function SolveResultScreen() {
  const { q, socratic, think } = useLocalSearchParams<{ q?: string; socratic?: string; think?: string }>();
  const questionText = typeof q === 'string' ? q : '';
  const socraticMode = socratic === '1';
  const thinkLock = think === '1';

  const [unlocked, setUnlocked] = useState(!thinkLock);
  const [thumb, setThumb] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!thinkLock) return;
    const t = setTimeout(() => setUnlocked(true), 30000);
    return () => clearTimeout(t);
  }, [thinkLock]);

  const result = useMemo(() => generateStubSolution(questionText, socraticMode), [questionText, socraticMode]);
  const showSolution = !thinkLock || unlocked;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.banner}>
          <Ionicons name="information-circle-outline" size={20} color="#b45309" />
          <Text style={styles.bannerText}>
            Bu cevap AI tarafından üretilmiştir; doğruluğunu kontrol et (PDF 18.2).
          </Text>
        </View>

        <Text style={styles.section}>Orijinal soru</Text>
        <View style={styles.card}>
          <Text style={styles.questionText}>{questionText}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>Sınıf: {result.subject}</Text>
          <Text style={styles.meta}>Güven: {result.confidenceNote.slice(0, 40)}…</Text>
        </View>

        {thinkLock && !unlocked ? (
          <View style={styles.lockBox}>
            <Text style={styles.lockText}>Önce düşün modu: 30 saniye sonra çözüm açılır…</Text>
          </View>
        ) : null}

        {showSolution ? (
          <>
            {socraticMode ? (
              <>
                <Text style={styles.section}>İpuçları (Sokratik)</Text>
                {result.socraticHints.map((h, i) => (
                  <View key={i} style={styles.stepCard}>
                    <Text style={styles.stepDetail}>{h}</Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.section}>Adım adım çözüm</Text>
                {result.steps.map((s, i) => (
                  <View key={i} style={styles.stepCard}>
                    <Text style={styles.stepTitle}>{s.title}</Text>
                    <Text style={styles.stepDetail}>{s.detail}</Text>
                    <Pressable style={styles.micro}>
                      <Text style={styles.microText}>Bu adımı anlamadım (stub)</Text>
                    </Pressable>
                  </View>
                ))}
                <Text style={styles.section}>Ek ipuçları</Text>
                {result.socraticHints.slice(0, 2).map((h, i) => (
                  <Text key={i} style={styles.hintLine}>
                    • {h}
                  </Text>
                ))}
              </>
            )}

            <View style={styles.actions}>
              <Pressable style={styles.outlineBtn}>
                <Text style={styles.outlineText}>Soru bankasına ekle (stub)</Text>
              </Pressable>
              <Pressable style={styles.outlineBtn}>
                <Text style={styles.outlineText}>Benzer 5 soru (stub)</Text>
              </Pressable>
            </View>

            <Text style={styles.rateLabel}>Çözüm kalitesi</Text>
            <View style={styles.rateRow}>
              <Pressable onPress={() => setThumb('up')} style={styles.rateBtn}>
                <Ionicons name="thumbs-up-outline" size={28} color={thumb === 'up' ? Brand.success : '#94a3b8'} />
              </Pressable>
              <Pressable onPress={() => setThumb('down')} style={styles.rateBtn}>
                <Ionicons name="thumbs-down-outline" size={28} color={thumb === 'down' ? Brand.danger : '#94a3b8'} />
              </Pressable>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 18 },
  section: { fontSize: 15, fontWeight: '800', color: Brand.navy, marginBottom: 10, marginTop: 8 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  questionText: { fontSize: 15, color: '#0f172a', lineHeight: 22 },
  metaRow: { marginBottom: 12 },
  meta: { fontSize: 12, color: '#64748b' },
  lockBox: {
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  lockText: { fontSize: 14, color: '#475569' },
  stepCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  stepTitle: { fontSize: 14, fontWeight: '700', color: Brand.navy, marginBottom: 6 },
  stepDetail: { fontSize: 14, color: '#334155', lineHeight: 21 },
  micro: { marginTop: 10 },
  microText: { fontSize: 13, color: Brand.purple, fontWeight: '600' },
  hintLine: { fontSize: 14, color: '#475569', marginBottom: 6, lineHeight: 20 },
  actions: { marginTop: 16, gap: 8 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  outlineText: { fontWeight: '600', color: '#475569' },
  rateLabel: { marginTop: 20, fontSize: 13, color: '#64748b' },
  rateRow: { flexDirection: 'row', gap: 24, marginTop: 8 },
  rateBtn: { padding: 8 },
});
