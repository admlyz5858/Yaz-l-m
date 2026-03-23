import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';
import type { ExamType, YksField } from '@/store/onboardingStore';
import { useOnboardingStore } from '@/store/onboardingStore';

const EXAMS: { id: ExamType; label: string; hint: string }[] = [
  { id: 'YKS', label: 'YKS (TYT + AYT)', hint: 'Puan türü seçilebilir' },
  { id: 'LGS', label: 'LGS', hint: '7–8. sınıf' },
  { id: 'KPSS', label: 'KPSS', hint: 'GY / GK / ÖABT' },
  { id: 'ALES', label: 'ALES', hint: 'Lisansüstü' },
  { id: 'DGS', label: 'DGS', hint: 'Dikey geçiş' },
  { id: 'UNIVERSITY', label: 'Üniversite Dersleri', hint: 'Vize / final' },
  { id: 'OTHER', label: 'Diğer', hint: 'Özel hedef' },
];

const YKS_FIELDS: { id: YksField; label: string }[] = [
  { id: 'SAY', label: 'SAY' },
  { id: 'EA', label: 'EA' },
  { id: 'SOZ', label: 'SÖZ' },
  { id: 'DIL', label: 'DİL' },
];

/**
 * Ekran 5 — Sınav seçimi Step 2/4 (PDF Bölüm 2.5).
 */
export default function ExamsStepScreen() {
  const router = useRouter();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);

  const [selected, setSelected] = useState<ExamType[]>(draft.examTypes);
  const [yksField, setYksField] = useState<YksField | undefined>(draft.yksField);
  const [targetNet, setTargetNet] = useState(draft.targetNet ?? '');

  const toggle = (id: ExamType) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onContinue = () => {
    setDraft({
      examTypes: selected,
      yksField: selected.includes('YKS') ? yksField : undefined,
      targetNet: targetNet.trim() || undefined,
    });
    router.push('/onboarding/assessment');
  };

  const yksSelected = selected.includes('YKS');

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.intro}>Hedef sınavını seç; birden fazla işaretleyebilirsin.</Text>

      {EXAMS.map((exam) => {
        const on = selected.includes(exam.id);
        return (
          <Pressable
            key={exam.id}
            style={[styles.card, on && styles.cardOn]}
            onPress={() => toggle(exam.id)}>
            <Text style={styles.cardTitle}>{exam.label}</Text>
            <Text style={styles.cardHint}>{exam.hint}</Text>
          </Pressable>
        );
      })}

      {yksSelected ? (
        <View style={styles.yksBox}>
          <Text style={styles.label}>Hangi puan türü? (YKS)</Text>
          <View style={styles.chips}>
            {YKS_FIELDS.map((f) => (
              <Pressable
                key={f.id}
                style={[styles.chip, yksField === f.id && styles.chipOn]}
                onPress={() => setYksField(f.id)}>
                <Text style={[styles.chipText, yksField === f.id && styles.chipTextOn]}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <Text style={styles.label}>Hedef net veya puan (opsiyonel)</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: TYT 85 net"
        value={targetNet}
        onChangeText={setTargetNet}
      />

      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
        <Text style={styles.progressText}>Adım 2 / 4</Text>
      </View>

      <Pressable style={styles.primary} onPress={onContinue}>
        <Text style={styles.primaryText}>Devam Et</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  intro: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardOn: { borderColor: Brand.purple, backgroundColor: 'rgba(168,85,247,0.08)' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardHint: { fontSize: 13, color: '#64748b', marginTop: 4 },
  yksBox: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  chipOn: { borderColor: Brand.purple, backgroundColor: 'rgba(168,85,247,0.12)' },
  chipText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  chipTextOn: { color: Brand.navy },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  progress: { marginVertical: 16 },
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
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
