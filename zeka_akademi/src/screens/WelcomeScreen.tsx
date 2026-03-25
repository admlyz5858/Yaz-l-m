/**
 * Karşılama — LadeK Academy
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandLogo from '../components/BrandLogo';
import { brand } from '../theme/colors';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export default function WelcomeScreen({ onSignUp, onSignIn }: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={['#0a1628', '#1e40af']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <BrandLogo variant="light" size="large" />
          <Text style={styles.subtitle}>{brand.tagline}</Text>
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
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
    paddingHorizontal: 8,
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
    color: '#0c1929',
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
