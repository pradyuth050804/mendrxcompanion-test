import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CheckinHeader from '@/components/CheckinHeader';
import CheckinSlider from '@/components/CheckinSlider';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function SymptomsScreen() {
  const router = useRouter();
  const [bloating, setBloating] = useState(0);
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState(5);
  const [acidity, setAcidity] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      await supabase.from('symptom_logs').upsert(
        { user_id: DEMO_USER_ID, log_date: today, bloating, energy, mood, acidity },
        { onConflict: 'user_id,log_date' }
      );

      await supabase.from('checkin_sessions').upsert(
        { user_id: DEMO_USER_ID, session_date: today, symptoms_done: true },
        { onConflict: 'user_id,session_date' }
      );

      router.push('/checkin/gut');
    } catch (e) {
      router.push('/checkin/gut');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CheckinHeader
        title="How are you feeling?"
        subtitle="Rate your symptoms today"
        step={1}
        totalSteps={4}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CheckinSlider
            label="Bloating"
            value={bloating}
            onChange={setBloating}
            lowEmoji="😌"
            highEmoji="😣"
            lowLabel="None"
            highLabel="Severe"
            color="#E8973A"
          />
          <CheckinSlider
            label="Energy Level"
            value={energy}
            onChange={setEnergy}
            lowEmoji="😴"
            highEmoji="⚡"
            lowLabel="Exhausted"
            highLabel="Energised"
            color="#4A90D9"
          />
          <CheckinSlider
            label="Mood"
            value={mood}
            onChange={setMood}
            lowEmoji="😞"
            highEmoji="😊"
            lowLabel="Low"
            highLabel="Great"
            color="#9B6DC5"
          />
          <CheckinSlider
            label="Acidity / Burping"
            value={acidity}
            onChange={setAcidity}
            lowEmoji="😌"
            highEmoji="🔥"
            lowLabel="None"
            highLabel="Frequent"
            color="#D97C7C"
          />
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
    backgroundColor: '#4A90D9',
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
