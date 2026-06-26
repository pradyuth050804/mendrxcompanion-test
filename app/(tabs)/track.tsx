import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useStore } from '@/store/useStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import DatePickerModal from '@/components/DatePickerModal';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { Check, Coffee, Pill, Activity, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrackScreen() {
  const sndPlan = useStore((state) => state.sndPlan);
  
  // Extract meals from the latest diet plan version
  const mealItems = useMemo(() => {
    if (!sndPlan?.dietPlanVersions || sndPlan.dietPlanVersions.length === 0) {
      return [
        { id: 'm1', label: 'Pre-Morning: Warm Water + Lemon', type: 'meal' },
        { id: 'm2', label: 'Breakfast: Oats & Berries', type: 'meal' },
        { id: 'm3', label: 'Lunch: Quinoa Salad', type: 'meal' },
        { id: 'm4', label: 'Dinner: Grilled Salmon', type: 'meal' },
      ]; // Fallback
    }
    const latestVersion = sndPlan.dietPlanVersions[sndPlan.dietPlanVersions.length - 1];
    const dayPlan = latestVersion.dayPlans?.[0]; // Default to first day
    if (!dayPlan) return [];
    
    const items = [];
    if (dayPlan.preMorning) items.push({ id: 'dp1', label: `Pre-Morning: ${dayPlan.preMorning}`, type: 'meal' });
    if (dayPlan.morning) items.push({ id: 'dp2', label: `Breakfast: ${dayPlan.morning}`, type: 'meal' });
    if (dayPlan.midMorning) items.push({ id: 'dp3', label: `Mid-Morning: ${dayPlan.midMorning}`, type: 'meal' });
    if (dayPlan.lunch) items.push({ id: 'dp4', label: `Lunch: ${dayPlan.lunch}`, type: 'meal' });
    if (dayPlan.earlyEvening) items.push({ id: 'dp5', label: `Evening: ${dayPlan.earlyEvening}`, type: 'meal' });
    if (dayPlan.night) items.push({ id: 'dp6', label: `Dinner: ${dayPlan.night}`, type: 'meal' });
    return items;
  }, [sndPlan]);

  // Extract supplements
  const supplementItems = useMemo(() => {
    if (!sndPlan?.supplements || sndPlan.supplements.length === 0) {
      return [
        { id: 's1', label: 'Vitamin D3 (1 capsule - Morning)', type: 'supplement' },
        { id: 's2', label: 'Omega 3 (1 capsule - Lunch)', type: 'supplement' },
        { id: 's3', label: 'Magnesium (1 tablet - Night)', type: 'supplement' },
      ]; // Fallback
    }
    return sndPlan.supplements.map(s => ({
      id: s.id,
      label: `${s.name} (${s.dosage} - ${s.timing})`,
      type: 'supplement'
    }));
  }, [sndPlan]);

  // Activity items (Generic)
  const activityItems = [
    { id: 'a1', label: '30 min brisk walk', type: 'activity' },
    { id: 'a2', label: '10 min morning stretching', type: 'activity' },
    { id: 'a3', label: '10,000 steps', type: 'activity' },
  ];

  const allItems = [...mealItems, ...supplementItems, ...activityItems];
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
    setCheckedIds(new Set()); // Reset checks for new date
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    if (newDate <= new Date()) { // Don't go into future
      setSelectedDate(newDate);
      setCheckedIds(new Set());
    }
  };
  
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const dateLabel = isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIds(newChecked);
  };

  const progress = allItems.length > 0 ? (checkedIds.size / allItems.length) * 100 : 0;
  
  // Submit handler
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCheckedIds(new Set());
    }, 3000);
  };
  
  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Check size={48} color={colors.primary} strokeWidth={3} />
          </View>
          <Text style={styles.successTitle}>Great job!</Text>
          <Text style={styles.successText}>Log saved successfully.</Text>
        </View>
      </View>
    );
  }

  // Render Checkbox list
  const renderList = (items: any[], color: string) => {
    return items.map((item, index) => {
      const isChecked = checkedIds.has(item.id);
      return (
        <TouchableOpacity 
          key={item.id} 
          style={[styles.checkItem, index === items.length - 1 && { borderBottomWidth: 0 }]}
          onPress={() => toggleCheck(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && { borderColor: color, backgroundColor: color }]}>
            {isChecked && <Check size={14} color={colors.white} strokeWidth={3.5} />}
          </View>
          <Text style={[styles.checkLabel, isChecked && styles.checkLabelDone]}>{item.label}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B3B2B', '#0E2319']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text style={styles.appName}>MendRx Companio</Text>
        
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Daily Log</Text>
            <Text style={styles.subtitle}>Track your prescribed plan</Text>
          </View>
          
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={handlePrevDay} style={styles.dateBtn}>
              <ChevronLeft size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <Text style={styles.dateText}>{dateLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleNextDay} 
              style={[styles.dateBtn, isToday && { opacity: 0.3 }]} 
              disabled={isToday}
            >
              <ChevronRight size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Main Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Today's Completion</Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: '#ECF3D6' }]}>
              <Coffee size={20} color={colors.lime} />
            </View>
            <Text style={styles.cardTitle}>Meals & Diet Plan</Text>
          </View>
          <View style={styles.cardBody}>
            {renderList(mealItems, colors.lime)}
          </View>
        </Card>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: '#FDE8F3' }]}>
              <Pill size={20} color={colors.pink} />
            </View>
            <Text style={styles.cardTitle}>Supplements</Text>
          </View>
          <View style={styles.cardBody}>
            {renderList(supplementItems, colors.pink)}
          </View>
        </Card>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: '#E0E7FF' }]}>
              <Activity size={20} color={colors.indigo} />
            </View>
            <Text style={styles.cardTitle}>Activity</Text>
          </View>
          <View style={styles.cardBody}>
            {renderList(activityItems, colors.indigo)}
          </View>
        </Card>
        
        <View style={{ height: spacing.xxl * 2 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Today's Log"
          onPress={handleSubmit}
          size="large"
        />
      </View>

      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setCheckedIds(new Set());
        }}
        maxDate={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 90 + spacing.xl : 70 + spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.lg,
  },
  appName: {
    ...typography.caption,
    color: '#A8C7A7',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '850' as any,
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.body,
    fontSize: 14,
    color: '#D1DDD6',
    marginTop: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  dateBtn: {
    padding: spacing.xs,
  },
  dateText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
    paddingHorizontal: spacing.xs,
    minWidth: 55,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressPercent: {
    ...typography.h2,
    color: '#A8C7A7',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A8C7A7',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  cardBody: {
    paddingVertical: spacing.sm,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F2',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.text.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 22,
  },
  checkLabelDone: {
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EAF2EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  successText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
