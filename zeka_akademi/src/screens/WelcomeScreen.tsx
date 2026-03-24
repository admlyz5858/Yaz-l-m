/**
 * EKRAN 2 — Karşılama Ekranı (Welcome Screen)
 * Tek sayfa, Hemen Başla / Giriş Yap
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export default function WelcomeScreen({ onSignUp, onSignIn }: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={['#0f766e', '#0d9488']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="school" size={80} color="#fff" />
          </View>
          <Text style={styles.title}>ZekaAkademi</Text>
          <Text style={styles.subtitle}>
            Akıllı sınav hazırlık platformu. AI destekli soru çözümü, flash kartlar ve kişisel planlama.
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={onSignUp}>
            <Text style={styles.primaryText}>Hemen Başla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onSignIn}>
            <Text style={styles.secondaryText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  buttons: { paddingBottom: 32 },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#0f766e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
