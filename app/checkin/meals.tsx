import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CheckinHeader from '@/components/CheckinHeader';
import PartialMealModal from '@/components/PartialMealModal';
import SupplementTrackingModal from '@/components/SupplementTrackingModal';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { Coffee, Utensils, Moon, Pill, Camera, Droplets, Plus, Minus } from 'lucide-react-native';
import MealPhotoCapture from '@/components/MealPhotoCapture';
import { supabase } from '@/lib/supabase';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

type MealType = 'breakfast' | 'lunch' | 'dinner';
type MealStatus = 'yes' | 'partial' | 'no' | null;

interface MealState {
  breakfast: MealStatus;
  lunch: MealStatus;
  dinner: MealStatus;
  supplements: boolean | null;
}

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Moon,
};

const STATUS_OPTIONS: { value: MealStatus; label: string; color: string; bg: string }[] = [
  { value: 'yes', label: 'Yes', color: '#6B8E6F', bg: '#EDF5EE' },
  { value: 'partial', label: 'Partial', color: '#E8973A', bg: '#FFF3E5' },
  { value: 'no', label: 'No', color: '#D97C7C', bg: '#FFF0F0' },
];

export default function MealsScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<MealState>({
    breakfast: null,
    lunch: null,
    dinner: null,
    supplements: null,
  });
  const [waterLitres, setWaterLitres] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [showSupplementModal, setShowSupplementModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const setMealStatus = (meal: MealType, status: MealStatus) => {
    setMeals((prev) => ({ ...prev, [meal]: status }));
    if (status === 'partial') {
      setSelectedMeal(meal);
      setShowPartialModal(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const mealsFollowed =
        meals.breakfast === 'yes' && meals.lunch === 'yes' && meals.dinner === 'yes'
          ? 'yes'
          : meals.breakfast === null && meals.lunch === null && meals.dinner === null
          ? 'no'
          : 'partial';

      await supabase.from('daily_logs').upsert(
        {
          user_id: DEMO_USER_ID,
          log_date: today,
          meals_followed: mealsFollowed,
          supplements_taken: meals.supplements ?? false,
          energy_level: 3,
          symptoms: [],
          sleep_hours: 7,
          water_intake: waterLitres,
        },
        { onConflict: 'user_id,log_date' }
      );

      await supabase.from('checkin_sessions').upsert(
        { user_id: DEMO_USER_ID, session_date: today, meals_done: true },
        { onConflict: 'user_id,session_date' }
      );

      router.push('/checkin/lifestyle');
    } catch (e) {
      router.push('/checkin/lifestyle');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CheckinHeader
        title="Meals Today"
        subtitle="What did you eat?"
        step={3}
        totalSteps={4}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((meal) => {
          const Icon = MEAL_ICONS[meal];
          const mealLabel = meal.charAt(0).toUpperCase() + meal.slice(1);
          const current = meals[meal];

          return (
            <View key={meal} style={[styles.card, { marginBottom: spacing.lg }]}>
              <View style={styles.mealHeader}>
                <View style={styles.mealIconWrap}>
                  <Icon size={20} color={colors.primary} />
                </View>
                <Text style={styles.mealTitle}>{mealLabel}</Text>
                <TouchableOpacity
                  style={styles.cameraBtn}
                  onPress={() => {
                    setSelectedMeal(meal);
                    setShowCamera(true);
                  }}
                >
                  <Camera size={18} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.statusBtn,
                      { backgroundColor: opt.bg },
                      current === opt.value && { borderColor: opt.color, borderWidth: 2 },
                    ]}
                    onPress={() => setMealStatus(meal, opt.value)}
                  >
                    <Text style={[styles.statusText, current === opt.value && { color: opt.color, fontWeight: '700' }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        <View style={[styles.card, { marginBottom: spacing.lg }]}>
          <View style={styles.mealHeader}>
            <View style={[styles.mealIconWrap, { backgroundColor: '#F0EDFB' }]}>
              <Pill size={20} color="#9B6DC5" />
            </View>
            <Text style={styles.mealTitle}>Supplements</Text>
          </View>

          <View style={styles.statusRow}>
            <TouchableOpacity
              style={[
                styles.statusBtnWide,
                { backgroundColor: '#EDF5EE' },
                meals.supplements === true && { borderColor: '#6B8E6F', borderWidth: 2 },
              ]}
              onPress={() => setMeals((p) => ({ ...p, supplements: true }))}
            >
              <Text style={[styles.statusText, meals.supplements === true && { color: '#6B8E6F', fontWeight: '700' }]}>
                Yes, took all
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusBtnWide,
                { backgroundColor: '#FFF3E5' },
                meals.supplements === false && { borderColor: '#E8973A', borderWidth: 2 },
              ]}
              onPress={() => {
                setMeals((p) => ({ ...p, supplements: false }));
                setShowSupplementModal(true);
              }}
            >
              <Text style={[styles.statusText, meals.supplements === false && { color: '#E8973A', fontWeight: '700' }]}>
                Partial / Missed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: spacing.lg }]}>
          <View style={styles.mealHeader}>
            <View style={[styles.mealIconWrap, { backgroundColor: '#E8F4FD' }]}>
              <Droplets size={20} color="#4A90D9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>Water Intake</Text>
              <Text style={styles.waterSubtitle}>How much water did you drink?</Text>
            </View>
          </View>

          <View style={styles.waterRow}>
            <TouchableOpacity
              style={[styles.waterBtn, waterLitres === 0 && styles.waterBtnDisabled]}
              onPress={() => setWaterLitres((v) => Math.max(0, parseFloat((v - 0.25).toFixed(2))))}
              disabled={waterLitres === 0}
            >
              <Minus size={18} color={waterLitres === 0 ? colors.text.light : '#4A90D9'} />
            </TouchableOpacity>

            <View style={styles.waterDisplay}>
              <Text style={styles.waterValue}>{waterLitres.toFixed(2)}</Text>
              <Text style={styles.waterUnit}>litres</Text>
            </View>

            <TouchableOpacity
              style={styles.waterBtn}
              onPress={() => setWaterLitres((v) => parseFloat((v + 0.25).toFixed(2)))}
            >
              <Plus size={18} color="#4A90D9" />
            </TouchableOpacity>
          </View>

          <View style={styles.waterQuickRow}>
            {[1, 1.5, 2, 2.5, 3].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.waterQuickBtn, waterLitres === l && styles.waterQuickBtnActive]}
                onPress={() => setWaterLitres(l)}
              >
                <Text style={[styles.waterQuickText, waterLitres === l && styles.waterQuickTextActive]}>
                  {l}L
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

      <MealPhotoCapture
        visible={showCamera}
        mealType={selectedMeal}
        onClose={() => setShowCamera(false)}
        onSuccess={() => setMeals((p) => ({ ...p, [selectedMeal]: 'yes' }))}
      />

      <PartialMealModal
        visible={showPartialModal}
        mealType={selectedMeal}
        onClose={() => setShowPartialModal(false)}
        onSuccess={() => {}}
      />

      <SupplementTrackingModal
        visible={showSupplementModal}
        onClose={() => setShowSupplementModal(false)}
        onSuccess={() => {}}
      />
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
    padding: spacing.md,
    ...shadows.md,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  mealIconWrap: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: '#EDF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    flex: 1,
  },
  cameraBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F6F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusBtnWide: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusText: {
    ...typography.small,
    color: colors.text.secondary,
    fontWeight: '500',
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
    backgroundColor: colors.primary,
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
  waterSubtitle: {
    ...typography.caption,
    color: colors.text.light,
    marginTop: 2,
  },
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginBottom: spacing.md,
  },
  waterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C5DEEF',
  },
  waterBtnDisabled: {
    backgroundColor: '#F5F6F3',
    borderColor: colors.border,
  },
  waterDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  waterValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90D9',
    lineHeight: 38,
  },
  waterUnit: {
    ...typography.small,
    color: colors.text.secondary,
  },
  waterQuickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  waterQuickBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: '#F5F6F3',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  waterQuickBtnActive: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4A90D9',
  },
  waterQuickText: {
    ...typography.small,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  waterQuickTextActive: {
    color: '#4A90D9',
  },
});
