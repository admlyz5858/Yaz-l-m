import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboardingStore';

const CAPACITY_MIN = 30;
const CAPACITY_MAX = 8 * 60;

type StudySlot = 'MORNING' | 'NOON' | 'EVENING' | 'NIGHT';

const SLOTS: { id: StudySlot; label: string }[] = [
  { id: 'MORNING', label: 'Sabah' },
  { id: 'NOON', label: 'Öğle' },
  { id: 'EVENING', label: 'Akşam' },
  { id: 'NIGHT', label: 'Gece' },
];

/**
 * Ekran 7 — Kişiselleştirme ve plan Step 4/4 (PDF Bölüm 2.7).
 */
export default function PlanStepScreen() {
  const router = useRouter();
  const setCompleted = useOnboardingStore((s) => s.setCompleted);

  const [capacityMin, setCapacityMin] = useState(45);
  const [slots, setSlots] = useState<StudySlot[]>(['EVENING']);
  const [planning, setPlanning] = useState(false);
  const [preview, setPreview] = useState(false);

  const toggleSlot = (id: StudySlot) => {
    setSlots((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const runPlanAnimation = async () => {
    setPlanning(true);
    await new Promise((r) => setTimeout(r, 3000));
    setPlanning(false);
    setPreview(true);
  };

  const onStartPlan = () => {
    setCompleted(true);
    router.replace('/(tabs)');
  };

  if (planning) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.purple} />
        <Text style={styles.planningText}>Planın hazırlanıyor...</Text>
      </View>
    );
  }

  if (preview) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Haftalık önizleme</Text>
        <Text style={styles.body}>
          Örnek: Pazartesi — Matematik 45 dk, Salı — Türkçe 30 dk ... (AI plan motoru bağlandığında
          gerçek takvim burada görünecek.)
        </Text>
        <Text style={styles.meta}>Günlük kapasite: {capacityMin} dk</Text>
        <Text style={styles.meta}>
          Tercih: {slots.map((s) => SLOTS.find((x) => x.id === s)?.label).join(', ')}
        </Text>
        <Pressable style={styles.primary} onPress={onStartPlan}>
          <Text style={styles.primaryText}>Planı Başlat</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.label}>Günlük çalışma kapasitesi (dakika)</Text>
      <View style={styles.sliderRow}>
        <Text style={styles.sliderVal}>{capacityMin} dk</Text>
        <Pressable style={styles.stepBtn} onPress={() => setCapacityMin((m) => Math.max(CAPACITY_MIN, m - 15))}>
          <Text style={styles.stepBtnText}>-</Text>
        </Pressable>
        <Pressable style={styles.stepBtn} onPress={() => setCapacityMin((m) => Math.min(CAPACITY_MAX, m + 15))}>
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>30 dk – 8 saat arası (PDF); adımlarla ayarlanır.</Text>

      <Text style={styles.label}>Çalışma saatleri tercihi</Text>
      <View style={styles.chips}>
        {SLOTS.map((s) => (
          <Pressable
            key={s.id}
            style={[styles.chip, slots.includes(s.id) && styles.chipOn]}
            onPress={() => toggleSlot(s.id)}>
            <Text style={[styles.chipText, slots.includes(s.id) && styles.chipTextOn]}>{s.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.note}>Sınav tarihi ve zayıf konular AI plan modülü ile birlikte eklenecek.</Text>

      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Adım 4 / 4</Text>
      </View>

      <Pressable style={styles.primary} onPress={runPlanAnimation}>
        <Text style={styles.primaryText}>AI ile Plan Oluştur</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  planningText: { marginTop: 16, fontSize: 17, fontWeight: '600', color: '#334155' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  body: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 16 },
  meta: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  sliderVal: { flex: 1, fontSize: 18, fontWeight: '700', color: Brand.navy },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  hint: { fontSize: 12, color: '#94a3b8', marginBottom: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
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
  note: { fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 18 },
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
