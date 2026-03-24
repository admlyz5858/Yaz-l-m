import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QUESTION_BANK } from '@/data/questionBank';
import { Brand } from '@/constants/theme';
import { useQuestionBankStore } from '@/store/questionBankStore';

/**
 * PDF Bölüm 5.2.3 — Soru çözüm modu (MCQ + anlık geri bildirim).
 */
export default function QuestionPracticeScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const recordAttempt = useQuestionBankStore((s) => s.recordAttempt);

  const q = useMemo(() => QUESTION_BANK.find((x) => x.question_id === id), [id]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [thinkFirst, setThinkFirst] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setSelected(null);
  }, [id]);

  useEffect(() => {
    if (!thinkFirst) {
      setLocked(false);
      return;
    }
    setLocked(true);
    const t = setTimeout(() => setLocked(false), 30000);
    return () => clearTimeout(t);
  }, [thinkFirst, id]);

  if (!q || q.soru_tipi !== 'MCQ' || !q.şıklar || q.doğru_index === undefined) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.err}>Soru bulunamadı.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Geri</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const answered = selected !== null;
  const correct = answered && selected === q.doğru_index;

  const onSelect = (idx: number) => {
    if (answered) return;
    if (thinkFirst && locked) return;
    setSelected(idx);
    recordAttempt(q.question_id, idx === q.doğru_index);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.toolbar}>
          <Text style={styles.timerToggle}>Süre göstergesi</Text>
          <Switch value={showTimer} onValueChange={setShowTimer} trackColor={{ true: Brand.purple }} />
        </View>
        <View style={styles.toolbar}>
          <Text style={styles.timerToggle}>Önce düşün (30 sn kilit)</Text>
          <Switch value={thinkFirst} onValueChange={setThinkFirst} trackColor={{ true: Brand.purple }} />
        </View>
        {showTimer ? <Text style={styles.timerFake}>⏱ Süre: — (stub)</Text> : null}
        {thinkFirst && locked ? <Text style={styles.lock}>Cevaplar kilitli…</Text> : null}

        <Text style={styles.qtext}>{q.metin}</Text>

        {q.şıklar.map((opt, idx) => {
          let bg = '#fff';
          let border = '#e2e8f0';
          if (answered) {
            if (idx === q.doğru_index) {
              bg = '#ecfdf5';
              border = Brand.success;
            } else if (idx === selected) {
              bg = '#fef2f2';
              border = Brand.danger;
            }
          } else if (selected === idx) {
            border = Brand.navy;
          }
          return (
            <Pressable
              key={idx}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}
              onPress={() => onSelect(idx)}
              disabled={answered}>
              <Text style={styles.optionLabel}>{String.fromCharCode(65 + idx)})</Text>
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}

        {answered ? (
          <View style={styles.feedback}>
            <Text style={[styles.feedTitle, { color: correct ? Brand.success : Brand.danger }]}>
              {correct ? 'Doğru' : 'Yanlış'}
            </Text>
            <Text style={styles.feedBody}>
              {correct
                ? 'Kısa açıklama: Mantık ve işlem doğru (stub).'
                : 'Doğru şık: ' + String.fromCharCode(65 + (q.doğru_index ?? 0)) + ' — tekrar dene veya konu notuna dön.'}
            </Text>
            <Pressable style={styles.next} onPress={() => router.back()}>
              <Text style={styles.nextText}>Listeye dön</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  err: { padding: 20, fontSize: 16 },
  back: { padding: 20, color: Brand.purple, fontWeight: '600' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timerToggle: { fontSize: 14, color: '#334155' },
  timerFake: { fontSize: 13, color: '#64748b', marginBottom: 8 },
  lock: { color: '#b45309', marginBottom: 8, fontWeight: '600' },
  qtext: { fontSize: 16, lineHeight: 24, color: '#0f172a', marginBottom: 20, fontWeight: '500' },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 10,
  },
  optionLabel: { fontWeight: '800', color: Brand.navy, width: 28 },
  optionText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  feedback: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  feedTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  feedBody: { fontSize: 14, color: '#475569', lineHeight: 20 },
  next: { marginTop: 12, alignSelf: 'flex-start' },
  nextText: { color: Brand.purple, fontWeight: '700' },
});
