import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';
import type { ExamInstitution } from '@/data/trExamCatalog';
import { TR_EXAM_CATALOG } from '@/data/trExamCatalog';
import type { ExamType, YksField } from '@/store/onboardingStore';
import { useOnboardingStore } from '@/store/onboardingStore';

const YKS_FIELDS: { id: YksField; label: string }[] = [
  { id: 'SAY', label: 'SAY' },
  { id: 'EA', label: 'EA' },
  { id: 'SOZ', label: 'SÖZ' },
  { id: 'DIL', label: 'DİL' },
];

const INSTITUTION_FILTERS: { id: 'ALL' | ExamInstitution; label: string }[] = [
  { id: 'ALL', label: 'Tümü' },
  { id: 'OSYM', label: 'ÖSYM' },
  { id: 'MEB', label: 'MEB' },
  { id: 'OTHER', label: 'Diğer' },
];

function institutionBadge(inst: ExamInstitution): string {
  switch (inst) {
    case 'OSYM':
      return 'ÖSYM';
    case 'MEB':
      return 'MEB';
    default:
      return 'Kurum';
  }
}

/**
 * Ekran 5 — Sınav seçimi Step 2/4 (PDF Bölüm 2.5).
 * Türkiye sınav kataloğu: grup + arama + kurum filtresi.
 */
export default function ExamsStepScreen() {
  const router = useRouter();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);

  const [selected, setSelected] = useState<ExamType[]>(draft.examTypes);
  const [yksField, setYksField] = useState<YksField | undefined>(draft.yksField);
  const [targetNet, setTargetNet] = useState(draft.targetNet ?? '');
  const [query, setQuery] = useState('');
  const [instFilter, setInstFilter] = useState<'ALL' | ExamInstitution>('ALL');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TR_EXAM_CATALOG.map((g) => ({
      title: g.title,
      exams: g.exams.filter((e) => {
        if (instFilter !== 'ALL' && e.institution !== instFilter) return false;
        if (!q) return true;
        return (
          e.label.toLowerCase().includes(q) ||
          e.hint.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        );
      }),
    })).filter((g) => g.exams.length > 0);
  }, [query, instFilter]);

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
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <Text style={styles.intro}>
        ÖSYM, MEB ve diğer kurum sınavlarından hedefini seç; birden fazla işaretleyebilirsin. Resmi tarihler
        uygulama içi takvimden güncellenir.
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Ara: YKS, KPSS, TUS, LGS…"
        placeholderTextColor="#94a3b8"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filterRow}>
        {INSTITUTION_FILTERS.map((f) => (
          <Pressable
            key={f.id}
            style={[styles.filterChip, instFilter === f.id && styles.filterChipOn]}
            onPress={() => setInstFilter(f.id)}>
            <Text style={[styles.filterChipText, instFilter === f.id && styles.filterChipTextOn]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {filteredGroups.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.exams.map((exam) => {
            const on = selected.includes(exam.id);
            return (
              <Pressable
                key={exam.id}
                style={[styles.card, on && styles.cardOn]}
                onPress={() => toggle(exam.id)}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{exam.label}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{institutionBadge(exam.institution)}</Text>
                  </View>
                </View>
                <Text style={styles.cardHint}>{exam.hint}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

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
  intro: { fontSize: 14, color: '#64748b', marginBottom: 16, lineHeight: 20 },
  search: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  filterChipOn: { borderColor: Brand.electricDim, backgroundColor: 'rgba(6,182,212,0.1)' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterChipTextOn: { color: Brand.navy },
  group: { marginBottom: 8 },
  groupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.navy,
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardOn: { borderColor: Brand.electricDim, backgroundColor: 'rgba(6,182,212,0.06)' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', flex: 1 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  cardHint: { fontSize: 13, color: '#64748b', marginTop: 6 },
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
