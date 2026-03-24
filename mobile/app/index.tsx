import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { LadekLogo } from '@/components/brand/LadekLogo';
import { Brand, BrandStrings, Splash } from '@/constants/theme';
import { runBootstrap } from '@/lib/bootstrap';

/**
 * Ladek ACADEMY giriş animasyonu: kitap + dijital ağaç, metin, hafif parıltı.
 */
export default function SplashRoute() {
  const router = useRouter();
  const [bootError, setBootError] = useState<string | null>(null);

  const bookScale = useRef(new Animated.Value(0.3)).current;
  const bookOpacity = useRef(new Animated.Value(0)).current;
  const treeOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await ExpoSplashScreen.hideAsync();

        Animated.sequence([
          Animated.parallel([
            Animated.spring(bookScale, {
              toValue: 1,
              friction: 6,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(bookOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(treeOpacity, {
            toValue: 1,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(titleOpacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(subOpacity, {
              toValue: 1,
              duration: 500,
              delay: 120,
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
    router,
    subOpacity,
    titleOpacity,
    treeOpacity,
  ]);

  return (
    <LinearGradient
      colors={[Brand.navy, Brand.navyMid, Brand.navyLight]}
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
          <Animated.View style={{ opacity: treeOpacity }}>
            <LadekLogo size={140} />
          </Animated.View>
        </View>
        <Animated.Text style={[styles.brandName, { opacity: titleOpacity }]}>{BrandStrings.appName}</Animated.Text>
        <Animated.Text style={[styles.brandAcademy, { opacity: subOpacity }]}>ACADEMY</Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: subOpacity }]}>{BrandStrings.tagline}</Animated.Text>
      </Animated.View>

      {bootError ? <Text style={styles.hint}>{bootError}</Text> : null}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ladek ACADEMY</Text>
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
  },
  brandName: {
    marginTop: 4,
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  brandAcademy: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(248,250,252,0.92)',
    letterSpacing: 4,
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: 'rgba(103,232,249,0.9)',
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
    letterSpacing: 1,
  },
});
