import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Brand, Splash } from '@/constants/theme';
import { runBootstrap } from '@/lib/bootstrap';

/**
 * Ekran 1 — Splash (PDF Bölüm 2.1): ~2.5 sn animasyon, token ve bağlantı kontrolü.
 */
export default function SplashRoute() {
  const router = useRouter();
  const [bootError, setBootError] = useState<string | null>(null);
  const logoY = useRef(new Animated.Value(-120)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await ExpoSplashScreen.hideAsync();

        Animated.parallel([
          Animated.timing(logoY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();

        const [result] = await Promise.all([
          runBootstrap(),
          new Promise((r) => setTimeout(r, Splash.durationMs)),
        ]);

        if (cancelled) return;

        if (!result.isConnected) {
          setBootError('Çevrimdışı mod: önbellekli içerikle devam edebilirsin.');
        }

        if (result.hasValidToken) {
          if (result.onboardingCompleted) {
            router.replace('/(drawer)/(tabs)');
          } else {
            router.replace('/onboarding/profile');
          }
        } else {
          router.replace('/welcome');
        }
      } catch (e) {
        if (!cancelled) {
          setBootError('Başlatma sırasında bir sorun oluştu.');
          setTimeout(() => router.replace('/welcome'), 1500);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [logoOpacity, logoY, router]);

  return (
    <LinearGradient colors={[Brand.navy, Brand.navyMid, Brand.purple]} style={styles.gradient}>
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ translateY: logoY }] }]}>
        <Text style={styles.logoMark}>ZA</Text>
        <Text style={styles.logoTitle}>ZekaAkademi</Text>
        <Text style={styles.logoSub}>Yapay zekâ destekli sınav hazırlığı</Text>
      </Animated.View>
      {bootError ? <Text style={styles.hint}>{bootError}</Text> : null}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Config • Token • Ağ</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoMark: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },
  logoTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
  },
  logoSub: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(248,250,252,0.85)',
    textAlign: 'center',
  },
  hint: {
    marginTop: 24,
    fontSize: 13,
    color: 'rgba(254,243,199,0.95)',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
});
