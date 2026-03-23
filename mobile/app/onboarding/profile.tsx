import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboardingStore';

/**
 * Ekran 4 — Profil Step 1/4 (PDF Bölüm 2.4).
 */
export default function ProfileStepScreen() {
  const router = useRouter();
  const draft = useOnboardingStore((s) => s.draft);
  const setDraft = useOnboardingStore((s) => s.setDraft);

  const [fullName, setFullName] = useState(draft.fullName);

  const onContinue = () => {
    if (!fullName.trim()) return;
    setDraft({ fullName: fullName.trim() });
    router.push('/onboarding/exams');
  };

  const onSkip = () => {
    router.push('/onboarding/exams');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.hint}>Ad ve soyad zorunludur; diğer alanlar isteğe bağlıdır.</Text>

      <Text style={styles.label}>Ad Soyad *</Text>
      <TextInput
        style={styles.input}
        placeholder="Adınız Soyadınız"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Doğum tarihi (yakında)</Text>
      <Text style={styles.placeholder}>Tarih seçici bu iterasyonda eklenecek.</Text>

      <Text style={styles.label}>Şehir / İlçe (opsiyonel)</Text>
      <Text style={styles.placeholder}>Konum seçimi sonraki iterasyonda.</Text>

      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>
        <Text style={styles.progressText}>Adım 1 / 4</Text>
      </View>

      <Pressable
        style={[styles.primary, !fullName.trim() && styles.disabled]}
        disabled={!fullName.trim()}
        onPress={onContinue}>
        <Text style={styles.primaryText}>Devam Et</Text>
      </Pressable>

      <Pressable onPress={onSkip}>
        <Text style={styles.skip}>Şimdi Değil</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  hint: { fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
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
  placeholder: { fontSize: 14, color: '#94a3b8', marginBottom: 16 },
  progress: { marginVertical: 20 },
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
    marginTop: 8,
  },
  disabled: { opacity: 0.45 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  skip: { marginTop: 16, textAlign: 'center', color: Brand.purple, fontWeight: '600', fontSize: 15 },
});
