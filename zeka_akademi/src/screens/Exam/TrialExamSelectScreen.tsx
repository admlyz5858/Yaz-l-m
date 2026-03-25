/**
 * Deneme sınavı seçimi — TYT / LGS mini denemeler
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TRIAL_EXAMS } from '../../data/trialExams';
import { colors } from '../../theme/colors';

interface TrialExamSelectScreenProps {
  navigation?: any;
}

export default function TrialExamSelectScreen({ navigation }: TrialExamSelectScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deneme Sınavı</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.lead}>
          Süreli mini denemelerle kendini ölç. Sorular mevcut Türkçe bankasından seçilir.
        </Text>
        {TRIAL_EXAMS.map((exam) => (
          <TouchableOpacity
            key={exam.id}
            style={styles.card}
            onPress={() => navigation?.navigate('TrialExamRun', { trialId: exam.id })}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="timer-outline" size={32} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{exam.title}</Text>
              <Text style={styles.cardSub}>{exam.subtitle}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaBadge}>{exam.examLabel}</Text>
                <Text style={styles.metaText}>
                  {exam.questionIds.length} soru · {exam.durationMinutes} dk
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginLeft: 4 },
  scroll: { padding: 16, paddingBottom: 32 },
  lead: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 14, color: colors.textSecondary, marginTop: 4, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 8 },
  metaBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  metaText: { fontSize: 13, color: colors.textSecondary },
});
