import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CheckinHeader from '@/components/CheckinHeader';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

const STOOL_TYPES = [
  {
    type: 1,
    emoji: '🪨',
    label: 'Type 1',
    desc: 'Separate hard lumps',
    color: '#D97C7C',
    bg: '#FFF0F0',
  },
  {
    type: 2,
    emoji: '🌰',
    label: 'Type 2',
    desc: 'Lumpy & sausage-like',
    color: '#E8973A',
    bg: '#FFF3E5',
  },
  {
    type: 3,
    emoji: '🌿',
    label: 'Type 3',
    desc: 'Sausage with cracks',
    color: '#B8A040',
    bg: '#FFFBEA',
  },
  {
    type: 4,
    emoji: '✅',
    label: 'Type 4',
    desc: 'Smooth & soft (Ideal)',
    color: '#6B8E6F',
    bg: '#EDF5EE',
  },
  {
    type: 5,
    emoji: '🌊',
    label: 'Type 5',
    desc: 'Soft blobs',
    color: '#4A90D9',
    bg: '#EBF4FF',
  },
  {
    type: 6,
    emoji: '💧',
    label: 'Type 6',
    desc: 'Fluffy, mushy',
    color: '#7BB3D9',
    bg: '#F0F7FF',
  },
  {
    type: 7,
    emoji: '🌀',
    label: 'Type 7',
    desc: 'Entirely liquid',
    color: '#9B6DC5',
    bg: '#F3EDFB',
  },
];

const FREQ_OPTIONS = [
  { value: 0, label: 'Not today' },
  { value: 1, label: '1 time' },
  { value: 2, label: '2 times' },
  { value: 3, label: '3+' },
];

const EASE_OPTIONS = [
  { value: 'easy', label: '😌 Easy', color: '#6B8E6F', bg: '#EDF5EE' },
  { value: 'strain', label: '😣 With strain', color: '#E8973A', bg: '#FFF3E5' },
  { value: 'not_today', label: '🚫 Not today', color: colors.text.light, bg: '#F5F6F3' },
];

export default function GutScreen() {
  const router = useRouter();
  const [stoolType, setStoolType] = useState<number>(4);
  const [frequency, setFrequency] = useState<number>(1);
  const [ease, setEase] = useState<string>('easy');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      await supabase.from('gut_logs').upsert(
        { user_id: DEMO_USER_ID, log_date: today, stool_type: stoolType, frequency, ease },
        { onConflict: 'user_id,log_date' }
      );

      await supabase.from('checkin_sessions').upsert(
        { user_id: DEMO_USER_ID, session_date: today, gut_done: true },
        { onConflict: 'user_id,session_date' }
      );

      router.push('/checkin/meals');
    } catch (e) {
      router.push('/checkin/meals');
    } finally {
      setSaving(false);
    }
  };

  const selected = STOOL_TYPES.find((s) => s.type === stoolType);

  return (
    <View style={styles.container}>
      <CheckinHeader
        title="Gut Health"
        subtitle="How was your digestion today?"
        step={2}
        totalSteps={4}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bristol Stool Chart</Text>
          <Text style={styles.sectionSubtitle}>Select the type that best matches today</Text>

          <View style={styles.stoolList}>
            {STOOL_TYPES.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.stoolRow,
                  { backgroundColor: stoolType === item.type ? item.bg : '#FAFAFA' },
                  stoolType === item.type && { borderColor: item.color, borderWidth: 2 },
                ]}
                onPress={() => setStoolType(item.type)}
                activeOpacity={0.8}
              >
                <Text style={styles.stoolEmoji}>{item.emoji}</Text>
                <View style={styles.stoolTextWrap}>
                  <Text style={[styles.stoolLabel, stoolType === item.type && { color: item.color }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.stoolDesc}>{item.desc}</Text>
                </View>
                {stoolType === item.type && (
                  <View style={[styles.selectedDot, { backgroundColor: item.color }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionTitle}>Frequency today</Text>
          <View style={styles.freqRow}>
            {FREQ_OPTIONS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.freqBtn, frequency === f.value && styles.freqBtnSelected]}
                onPress={() => setFrequency(f.value)}
              >
                <Text style={[styles.freqText, frequency === f.value && styles.freqTextSelected]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionTitle}>How was it?</Text>
          <View style={styles.easeRow}>
            {EASE_OPTIONS.map((e) => (
              <TouchableOpacity
                key={e.value}
                style={[
                  styles.easeBtn,
                  { backgroundColor: e.bg },
                  ease === e.value && { borderColor: e.color, borderWidth: 2 },
                ]}
                onPress={() => setEase(e.value)}
              >
                <Text style={[styles.easeText, ease === e.value && { color: e.color, fontWeight: '600' }]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, saving && styles.btnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{saving ? 'Saving...' : 'Save & Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F3' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.md,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.small,
    color: colors.text.light,
    marginBottom: spacing.md,
  },
  stoolList: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: spacing.md,
  },
  stoolEmoji: {
    fontSize: 26,
    width: 36,
    textAlign: 'center',
  },
  stoolTextWrap: {
    flex: 1,
  },
  stoolLabel: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  stoolDesc: {
    ...typography.small,
    color: colors.text.light,
    lineHeight: 16,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  freqRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  freqBtn: {
    flex: 1,
    minWidth: 70,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: '#F5F6F3',
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  freqBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  freqText: {
    ...typography.small,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  freqTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  easeRow: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  easeBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  easeText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: '#F5F6F3',
    ...shadows.lg,
  },
  btn: {
    backgroundColor: '#E8973A',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
