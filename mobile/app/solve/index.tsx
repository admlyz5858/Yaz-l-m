import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

/**
 * PDF Bölüm 5.1 — Soru girişi (metin MVP; OCR/kamera stub).
 */
export default function SolveInputScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [socratic, setSocratic] = useState(false);
  const [thinkLock, setThinkLock] = useState(false);

  const onSolve = () => {
    const q = text.trim();
    if (q.length < 5) {
      Alert.alert('Soru gerekli', 'Lütfen soru metnini yazın (en az birkaç kelime).');
      return;
    }
    router.push({
      pathname: '/solve/result',
      params: { q, socratic: socratic ? '1' : '0', think: thinkLock ? '1' : '0' },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>
          Kamera, galeri, el yazısı ve ses — sonraki sürümde. Şimdilik metin ile dene.
        </Text>

        <View style={styles.row}>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => Alert.alert('Yakında', 'Kamera ile OCR (Google Vision + Tesseract) eklenecek.')}>
            <Ionicons name="camera-outline" size={22} color={Brand.navy} />
            <Text style={styles.secondaryBtnText}>Kamera</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => Alert.alert('Yakında', 'Galeriden görüntü yükleme.')}>
            <Ionicons name="images-outline" size={22} color={Brand.navy} />
            <Text style={styles.secondaryBtnText}>Galeri</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Soru metni</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Soruyu buraya yapıştır veya yaz..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Sokratik mod (ipucu, tam çözüm değil)</Text>
          <Switch value={socratic} onValueChange={setSocratic} trackColor={{ true: Brand.purple }} />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Önce düşün (30 sn kilit — stub)</Text>
          <Switch value={thinkLock} onValueChange={setThinkLock} trackColor={{ true: Brand.purple }} />
        </View>

        <Pressable style={styles.primary} onPress={onSolve}>
          <Ionicons name="sparkles" size={20} color="#fff" />
          <Text style={styles.primaryText}>Çözümü göster</Text>
        </Pressable>

        <Text style={styles.footer}>
          Gerçek ortamda AI Gateway → GPT-4o / Claude yönlendirmesi yapılır (PDF 5.1.2).
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingBottom: 40 },
  hint: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  secondaryBtnText: { fontWeight: '600', color: Brand.navy },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  switchLabel: { flex: 1, fontSize: 14, color: '#334155' },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Brand.navy,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  footer: { marginTop: 20, fontSize: 12, color: '#94a3b8', lineHeight: 18 },
});
