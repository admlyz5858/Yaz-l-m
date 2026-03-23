import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';

/**
 * Profil sekmesi: ayarlar, abonelik, hedefler (PDF Bölüm 3.2).
 */
export default function ProfileTabScreen() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setCompleted = useOnboardingStore((s) => s.setCompleted);

  const logout = () => {
    setToken(null);
    setCompleted(false);
    router.replace('/welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.body}>Abonelik ve KVKK ayarları ileride burada olacak.</Text>
      <Pressable style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Çıkış (demo)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 24 },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: '#b91c1c', fontWeight: '700' },
});
