/**
 * LadeK Academy — Kitap + dijital ağaç (devre/ağ) amblemi — vektör ikonlarla
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type BrandLogoProps = {
  variant?: 'light' | 'dark';
  size?: 'large' | 'medium';
};

export default function BrandLogo({ variant = 'light', size = 'large' }: BrandLogoProps) {
  const isLight = variant === 'light';
  const bookColor = isLight ? '#e0f2fe' : '#1e3a8a';
  const treeColor = isLight ? '#22d3ee' : '#0ea5e9';
  const nodeColor = isLight ? '#ffffff' : '#22d3ee';
  const iconSize = size === 'large' ? 56 : 40;

  return (
    <View style={styles.wrap}>
      <View style={[styles.emblem, size === 'medium' && styles.emblemMedium]}>
        <MaterialCommunityIcons name="book-open-page-variant" size={iconSize} color={bookColor} />
        <View style={styles.treeOverlay}>
          <MaterialCommunityIcons name="source-branch" size={iconSize * 0.85} color={treeColor} />
        </View>
        <View style={[styles.glowDot, { backgroundColor: nodeColor }]} />
      </View>
      <Text style={[styles.wordmark, isLight && styles.wordmarkLight, size === 'medium' && styles.wordmarkMedium]}>
        LadeK
      </Text>
      <Text style={[styles.academy, isLight && styles.academyLight, size === 'medium' && styles.academyMedium]}>
        ACADEMY
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  emblem: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emblemMedium: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  treeOverlay: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowDot: {
    position: 'absolute',
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0c1929',
    letterSpacing: 0.5,
  },
  wordmarkLight: { color: '#ffffff' },
  wordmarkMedium: { fontSize: 22 },
  academy: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    letterSpacing: 4,
    marginTop: 2,
  },
  academyLight: { color: 'rgba(255,255,255,0.85)' },
  academyMedium: { fontSize: 10, letterSpacing: 3 },
});
