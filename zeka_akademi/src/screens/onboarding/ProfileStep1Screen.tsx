/**
 * EKRAN 4 — Profil Kurulum (Step 1/4: Temel Bilgiler)
 * Ad Soyad, Doğum tarihi, Şehir/İlçe, Cinsiyet
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileStep1ScreenProps {
  navigation: any;
  route?: { params?: { isGuest?: boolean } };
}

export default function ProfileStep1Screen({ navigation }: ProfileStep1ScreenProps) {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const canContinue = fullName.trim().length >= 2;

  const handleContinue = () => {
    navigation.navigate('ExamSelect');
  };

  const handleSkip = () => {
    navigation.navigate('ExamSelect');
  };

  return (
    <LinearGradient colors={['#0f766e', '#0d9488']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Profil Oluştur</Text>
          <Text style={styles.subtitle}>Step 1/4: Temel Bilgiler</Text>

          <Text style={styles.label}>Ad Soyad *</Text>
          <TextInput
            style={styles.input}
            placeholder="Adınız ve soyadınız"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Doğum Tarihi</Text>
          <TextInput
            style={styles.input}
            placeholder="GG.AA.YYYY"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.label}>Şehir / İlçe</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: İstanbul"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Cinsiyet (KVKK: Opsiyonel)</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.genderText}>Erkek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.genderText}>Kadın</Text>
            </TouchableOpacity>
          </View>

          {/* İlerleme çubuğu */}
          <View style={styles.progress}>
            <View style={[styles.progressBar, { width: '25%' }]} />
            <Text style={styles.progressText}>1/4</Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !canContinue && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={styles.primaryBtnText}>Devam Et</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Şimdi Değil</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 24, paddingTop: 48 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  genderBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    marginRight: 12,
  },
  progressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#0f766e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
