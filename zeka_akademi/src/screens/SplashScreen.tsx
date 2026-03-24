/**
 * EKRAN 1 — Splash Screen (Açılış Ekranı)
 * Belge: 2.5 sn animasyon, logo yukarıdan aşağı düşer, gradient (lacivert→mor)
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoSplashScreen from 'expo-splash-screen';

ExpoSplashScreen.preventAutoHideAsync();

interface SplashScreenProps {
  onFinish: (hasToken: boolean) => void;
}

export default function SplashScreenComponent({ onFinish }: SplashScreenProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Logo animasyonu: yukarıdan aşağı düşer (2.5 saniye)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoTranslate, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Kısa bekleme: config + token kontrolü
    const timer = setTimeout(() => {
      const hasValidToken = false;
      onFinish(hasValidToken);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslate }],
          },
        ]}
      >
        <Text style={styles.logoText}>ZekaAkademi</Text>
        <Text style={styles.logoSubtext}>Akıllı Eğitim Platformu</Text>
      </Animated.View>
    </View>
  );
}

const colors = {
  gradientStart: '#0f766e',
  gradientEnd: '#0d9488',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
});
