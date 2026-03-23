import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';

/**
 * Ekran 3 — Kayıt / Giriş (PDF Bölüm 2.3) — MVP: formlar ve KVKK onayı; OAuth stub.
 */
export default function AuthScreen() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const completed = useOnboardingStore((s) => s.completed);
  const setCompleted = useOnboardingStore((s) => s.setCompleted);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kvkk, setKvkk] = useState(false);

  const continueAfterLogin = () => {
    if (completed) {
      router.replace('/(drawer)/(tabs)');
    } else {
      router.replace('/onboarding/profile');
    }
  };

  const onDemoLogin = () => {
    setToken(`demo-${Date.now()}`);
    continueAfterLogin();
  };

  const onEmailSubmit = () => {
    if (!kvkk) return;
    setToken(`email-${Date.now()}`);
    continueAfterLogin();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="ornek@posta.com"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Şifre</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.kvkkRow}>
          <Switch value={kvkk} onValueChange={setKvkk} trackColor={{ true: Brand.purple }} />
          <Text style={styles.kvkkText}>
            KVKK aydınlatma metnini okudum; kişisel verilerimin işlenmesine onay veriyorum.
          </Text>
        </View>

        <Pressable
          style={[styles.primary, !kvkk && styles.disabled]}
          disabled={!kvkk}
          onPress={onEmailSubmit}>
          <Text style={styles.primaryText}>Kayıt ol / Giriş (OTP sonrası)</Text>
        </Pressable>

        <Text style={styles.stub}>Google / Apple / SMS OTP — entegrasyon sonraki iterasyonda.</Text>

        <Pressable style={styles.demo} onPress={onDemoLogin}>
          <Text style={styles.demoText}>Demo olarak devam et</Text>
        </Pressable>

        <Pressable
          style={styles.guest}
          onPress={() => {
            setToken('guest');
            setCompleted(true);
            router.replace('/(drawer)/(tabs)');
          }}>
          <Text style={styles.guestText}>Misafir: 3 deneme (stub)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingBottom: 40 },
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
  kvkkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  kvkkText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 },
  primary: {
    backgroundColor: Brand.navy,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: { opacity: 0.45 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  stub: { fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  demo: {
    borderWidth: 1,
    borderColor: Brand.purple,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  demoText: { color: Brand.purple, fontWeight: '700', fontSize: 15 },
  guest: { marginTop: 16, alignItems: 'center' },
  guestText: { color: '#94a3b8', fontSize: 13 },
});
