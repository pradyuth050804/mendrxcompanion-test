import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CheckinHeader from '@/components/CheckinHeader';
import CheckinSlider from '@/components/CheckinSlider';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { Zap, Activity } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function LifestyleScreen() {
  const router = useRouter();
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      await supabase.from('lifestyle_logs').upsert(
        {
          user_id: DEMO_USER_ID,
          log_date: today,
          sleep_quality: sleepQuality,
          stress_level: stressLevel,
          is_active: isActive ?? false,
        },
        { onConflict: 'user_id,log_date' }
      );

      await supabase.from('checkin_sessions').upsert(
        {
          user_id: DEMO_USER_ID,
          session_date: today,
          lifestyle_done: true,
          is_complete: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,session_date' }
      );

      router.push('/checkin/complete');
    } catch (e) {
      router.push('/checkin/complete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CheckinHeader
        title="Lifestyle"
        subtitle="Last step — almost done!"
        step={4}
        totalSteps={4}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CheckinSlider
            label="Sleep Quality"
            value={sleepQuality}
            onChange={setSleepQuality}
            lowEmoji="😴"
            highEmoji="🌟"
            lowLabel="Poor"
            highLabel="Excellent"
            color="#9B6DC5"
          />
          <CheckinSlider
            label="Stress Level"
            value={stressLevel}
            onChange={setStressLevel}
            lowEmoji="😌"
            highEmoji="😰"
            lowLabel="Calm"
            highLabel="Very stressed"
            color="#D97C7C"
          />
        </View>

        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <View style={styles.activityHeader}>
            <View style={styles.activityIconWrap}>
              <Activity size={20} color="#4A90D9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Physical Activity</Text>
              <Text style={styles.activitySubtitle}>Were you active today?</Text>
            </View>
          </View>

          <View style={styles.activityRow}>
            <TouchableOpacity
              style={[
                styles.activityBtn,
                { backgroundColor: '#EBF4FF' },
                isActive === true && { borderColor: '#4A90D9', borderWidth: 2.5 },
              ]}
              onPress={() => setIsActive(true)}
              activeOpacity={0.8}
            >
              <Zap size={28} color={isActive === true ? '#4A90D9' : '#9BA89F'} />
              <Text style={[styles.activityBtnLabel, isActive === true && { color: '#4A90D9', fontWeight: '700' }]}>
                Active
              </Text>
              <Text style={styles.activityBtnSub}>Walk, gym, yoga...</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.activityBtn,
                { backgroundColor: '#F5F6F3' },
                isActive === false && { borderColor: colors.text.light, borderWidth: 2.5 },
              ]}
              onPress={() => setIsActive(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.activityRestEmoji}>🛋️</Text>
              <Text style={[styles.activityBtnLabel, isActive === false && { color: colors.text.secondary, fontWeight: '700' }]}>
                Rest day
              </Text>
              <Text style={styles.activityBtnSub}>Taking it easy</Text>
            </TouchableOpacity>
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
          <Text style={styles.btnText}>{saving ? 'Saving...' : 'Finish Check-in'}</Text>
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
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  activityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  activitySubtitle: {
    ...typography.caption,
    color: colors.text.light,
  },
  activityRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  activityBtn: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: spacing.xs,
  },
  activityRestEmoji: {
    fontSize: 28,
  },
  activityBtnLabel: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  activityBtnSub: {
    ...typography.caption,
    color: colors.text.light,
    textAlign: 'center',
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
    backgroundColor: '#9B6DC5',
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
