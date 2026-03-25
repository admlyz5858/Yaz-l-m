/**
 * EKRAN 1 — Splash (LadeK Academy)
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoSplashScreen from 'expo-splash-screen';
import BrandLogo from '../components/BrandLogo';

ExpoSplashScreen.preventAutoHideAsync();

interface SplashScreenProps {
  onFinish: (hasToken: boolean) => void;
}

export default function SplashScreenComponent({ onFinish }: SplashScreenProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
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

    const timer = setTimeout(() => {
      onFinish(false);
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
        <BrandLogo variant="light" size="large" />
      </Animated.View>
    </View>
  );
}

const colors = {
  gradientStart: '#0a1628',
  gradientEnd: '#1e40af',
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
});
