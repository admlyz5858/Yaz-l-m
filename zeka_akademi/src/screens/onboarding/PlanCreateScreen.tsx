/**
 * EKRAN 7 — Kişiselleştirme ve Plan Oluşturma (Step 4/4)
 * AI plan oluşturma, 3 sn animasyon, "Planı Başlat"
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PlanCreateScreenProps {
  navigation: any;
}

export default function PlanCreateScreen({ navigation }: PlanCreateScreenProps) {
  const [phase, setPhase] = useState<'config' | 'generating' | 'ready'>('config');
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    if (phase === 'generating') {
      const t = setTimeout(() => setPhase('ready'), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleGenerate = () => {
    setPhase('generating');
  };

  const handleStart = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  if (phase === 'generating') {
    return (
      <LinearGradient colors={['#0f766e', '#0d9488']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.generatingText}>Planın hazırlanıyor...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (phase === 'ready') {
    return (
      <LinearGradient colors={['#0f766e', '#0d9488']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <Text style={styles.readyTitle}>Planın Hazır!</Text>
          <Text style={styles.readySubtitle}>Haftalık görünüm</Text>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Planı Başlat</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f766e', '#0d9488']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Plan Oluştur</Text>
        <Text style={styles.subtitle}>Step 4/4</Text>
        <Text style={styles.label}>Günlük çalışma: {dailyMinutes} dk</Text>
        <Text style={styles.label}>Tercih: {preferredTime}</Text>
        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Text style={styles.generateBtnText}>AI ile Plan Oluştur</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 32 },
  label: { color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  generateBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
  },
  generateBtnText: { color: '#0f766e', fontWeight: 'bold' },
  generatingText: { marginTop: 16, color: '#fff', fontSize: 16 },
  readyTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  readySubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 32 },
  startBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  startBtnText: { color: '#0f766e', fontWeight: 'bold', fontSize: 16 },
});
