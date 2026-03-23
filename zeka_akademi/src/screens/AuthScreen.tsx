/**
 * EKRAN 3 — Kayıt / Giriş Ekranı
 * E-posta+Şifre, Google OAuth, Apple, Telefon OTP, Misafir Modu
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthScreenProps {
  navigation: any;
  route?: { params?: { mode?: 'signup' | 'signin' } };
}

export default function AuthScreen({ navigation, route }: AuthScreenProps) {
  const mode = route?.params?.mode ?? 'signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  const handleContinue = () => {
    if (mode === 'signup' && !kvkkAccepted) return;
    // TODO: API çağrısı
    navigation.navigate('ProfileStep1');
  };

  const handleGuest = () => {
    navigation.navigate('ProfileStep1', { isGuest: true });
  };

  return (
    <LinearGradient colors={['#1a237e', '#7c4dff']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboard}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>
              {mode === 'signup' ? 'Hesap Oluştur' : 'Giriş Yap'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {mode === 'signup' && (
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setKvkkAccepted(!kvkkAccepted)}
              >
                <View style={[styles.checkbox, kvkkAccepted && styles.checkboxChecked]} />
                <Text style={styles.checkLabel}>
                  KVKK aydınlatma metnini okudum ve kabul ediyorum (zorunlu)
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, (!kvkkAccepted && mode === 'signup') && styles.btnDisabled]}
              onPress={handleContinue}
              disabled={mode === 'signup' && !kvkkAccepted}
            >
              <Text style={styles.primaryBtnText}>
                {mode === 'signup' ? 'Kayıt Ol' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>Google ile devam et</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>Apple ile devam et</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>Telefon ile devam et</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
              <Text style={styles.guestText}>Misafir olarak devam et (3 deneme)</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  keyboard: { flex: 1 },
  scroll: { padding: 24, paddingTop: 48 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#fff',
  },
  checkLabel: {
    flex: 1,
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialBtn: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  socialBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guestBtn: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
