import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { LadekLogo } from '@/components/brand/LadekLogo';
import { Brand, BrandStrings, Splash } from '@/constants/theme';
import { runBootstrap } from '@/lib/bootstrap';

/**
 * LadeK Academy giriş: kitap ölçek, ağaç + düğüm parıltısı, başlık.
 */
export default function SplashRoute() {
  const router = useRouter();
  const [bootError, setBootError] = useState<string | null>(null);

  const bookScale = useRef(new Animated.Value(0.28)).current;
  const bookOpacity = useRef(new Animated.Value(0)).current;
  const treeOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const haloPulse = useRef(new Animated.Value(0)).current;
  const nodePulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await ExpoSplashScreen.hideAsync();

        Animated.loop(
          Animated.sequence([
            Animated.timing(haloPulse, {
              toValue: 1,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(haloPulse, {
              toValue: 0,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(nodePulse, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(nodePulse, {
              toValue: 0,
              duration: 900,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ).start();

        Animated.sequence([
          Animated.parallel([
            Animated.spring(bookScale, {
              toValue: 1,
              friction: 5,
              tension: 42,
              useNativeDriver: true,
            }),
            Animated.timing(bookOpacity, {
              toValue: 1,
              duration: 520,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(treeOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(titleOpacity, {
              toValue: 1,
              duration: 420,
              useNativeDriver: true,
            }),
            Animated.timing(subOpacity, {
              toValue: 1,
              duration: 520,
              delay: 100,
              useNativeDriver: true,
            }),
          ]),
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
  }, [
    bookOpacity,
    bookScale,
    haloPulse,
    nodePulse,
    router,
    subOpacity,
    titleOpacity,
    treeOpacity,
  ]);

  const haloStyle = {
    opacity: haloPulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] }),
    transform: [
      {
        scale: haloPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }),
      },
    ],
  };

  const nodeRingStyle = {
    opacity: nodePulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    transform: [
      {
        scale: nodePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }),
      },
    ],
  };

  return (
    <LinearGradient
      colors={[Brand.navyDeep, Brand.navy, Brand.navyMid]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <Animated.View
        style={[
          styles.logoBlock,
          {
            opacity: bookOpacity,
            transform: [{ scale: bookScale }],
          },
        ]}>
        <View style={styles.logoInner}>
          <Animated.View style={[styles.haloRing, haloStyle]} pointerEvents="none" />
          <Animated.View style={{ opacity: treeOpacity }}>
            <LadekLogo size={148} />
          </Animated.View>
          <Animated.View style={[styles.nodeRing, nodeRingStyle]} pointerEvents="none" />
        </View>
        <Animated.Text style={[styles.brandName, { opacity: titleOpacity }]}>{BrandStrings.appName}</Animated.Text>
        <Animated.Text style={[styles.brandAcademy, { opacity: subOpacity }]}>ACADEMY</Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: subOpacity }]}>{BrandStrings.tagline}</Animated.Text>
      </Animated.View>

      {bootError ? <Text style={styles.hint}>{bootError}</Text> : null}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{BrandStrings.appNameFull}</Text>
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
  logoBlock: {
    alignItems: 'center',
  },
  logoInner: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  haloRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    backgroundColor: 'rgba(0, 229, 255, 0.06)',
  },
  nodeRing: {
    position: 'absolute',
    bottom: 52,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  brandName: {
    marginTop: 4,
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  brandAcademy: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(248,250,252,0.92)',
    letterSpacing: 5,
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: 'rgba(103,232,249,0.95)',
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
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.2,
  },
});
