import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Card from '@/components/Card';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { TrendingUp, TrendingDown, Minus, Activity, Sparkles, Scale } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WEEKLY_DATA = [
  { day: 'Mon', adherence: 85 },
  { day: 'Tue', adherence: 70 },
  { day: 'Wed', adherence: 90 },
  { day: 'Thu', adherence: 75 },
  { day: 'Fri', adherence: 80 },
  { day: 'Sat', adherence: 95 },
  { day: 'Sun', adherence: 88 },
];

const ENERGY_DATA = [3, 3, 4, 3, 4, 4, 5];

const SYMPTOMS = [
  { name: 'Bloating', trend: 'down', change: -30, status: 'Improving' },
  { name: 'Fatigue', trend: 'down', change: -45, status: 'Improving' },
  { name: 'Acidity', trend: 'stable', change: 0, status: 'Stable' },
];

export default function ProgressScreen() {
  const maxAdherence = Math.max(...WEEKLY_DATA.map((d) => d.adherence));
  const avgAdherence = Math.round(
    WEEKLY_DATA.reduce((sum, d) => sum + d.adherence, 0) / WEEKLY_DATA.length
  );

  const renderTrendBadge = (trend: string, change: number, status: string) => {
    if (trend === 'down') {
      return (
        <View style={[styles.badge, styles.badgeSuccess]}>
          <TrendingDown size={14} color={colors.success} />
          <Text style={styles.badgeSuccessText}>{change}%</Text>
        </View>
      );
    }
    if (trend === 'up') {
      return (
        <View style={[styles.badge, styles.badgeError]}>
          <TrendingUp size={14} color={colors.error} />
          <Text style={styles.badgeErrorText}>+{change}%</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgeNeutral]}>
        <Minus size={14} color={colors.text.light} />
        <Text style={styles.badgeNeutralText}>0%</Text>
      </View>
    );
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
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>7-day metabolic trends</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Adherence Score Card */}
        <Card variant="elevated" style={styles.adherenceCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.metricLabel}>AVERAGE ADHERENCE</Text>
              <View style={styles.percentageRow}>
                <Text style={styles.percentageText}>{avgAdherence}%</Text>
                <Text style={styles.percentageUnit}>Score</Text>
              </View>
            </View>
            <View style={styles.badgeSpark}>
              <Sparkles size={14} color="#F2B84B" fill="#F2B84B" />
              <Text style={styles.sparkText}>Optimal</Text>
            </View>
          </View>

          {/* Premium Rounded Bar Chart */}
          <View style={styles.chartContainer}>
            {WEEKLY_DATA.map((item, index) => {
              const heightPercent = (item.adherence / 100) * 100;
              const isHighest = item.adherence === maxAdherence;
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPercent}%` },
                        isHighest && styles.barFillHighest,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isHighest && styles.barLabelActive]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Energy Trend Section */}
        <Card variant="elevated" style={styles.energyCard}>
          <Text style={styles.cardTitle}>Energy & Vitality</Text>
          <Text style={styles.energySubtitle}>Self-reported daily levels (Scale 1-5)</Text>

          <View style={styles.energyChartArea}>
            <View style={styles.energyChart}>
              {ENERGY_DATA.map((level, index) => {
                const heightPercent = (level / 5) * 100;
                return (
                  <View key={index} style={styles.energyCol}>
                    <View style={styles.energyLineTrack} />
                    <View
                      style={[
                        styles.energyDot,
                        { bottom: `${heightPercent - 10}%` },
                        level === 5 && styles.energyDotHigh,
                      ]}
                    />
                  </View>
                );
              })}
            </View>
            <View style={styles.energyXLabels}>
              {WEEKLY_DATA.map((item, index) => (
                <Text key={index} style={styles.energyXText}>
                  {item.day}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.trendRow}>
            <TrendingUp size={16} color={colors.success} />
            <Text style={styles.trendText}>
              Vitality improved by <Text style={{ fontWeight: '700' }}>40%</Text> compared to last week.
            </Text>
          </View>
        </Card>

        {/* Symptom Trends Section */}
        <Card variant="elevated" style={styles.symptomsCard}>
          <Text style={styles.cardTitle}>Symptom Reductions</Text>
          <View style={styles.symptomList}>
            {SYMPTOMS.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <View style={styles.symptomMeta}>
                  <Activity size={16} color={colors.primary} />
                  <Text style={styles.symptomName}>{symptom.name}</Text>
                </View>
                <View style={styles.symptomStatusWrap}>
                  <Text style={styles.symptomStatusText}>{symptom.status}</Text>
                  {renderTrendBadge(symptom.trend, symptom.change, symptom.status)}
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Weight Tracker Section */}
        <Card variant="elevated" style={styles.weightCard}>
          <View style={styles.weightHeader}>
            <Scale size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>Weight Protocol</Text>
          </View>
          <View style={styles.weightRow}>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Initial</Text>
              <Text style={styles.weightValue}>52 kg</Text>
            </View>
            <View style={styles.weightIndicatorArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Current</Text>
              <Text style={[styles.weightValue, { color: colors.primary }]}>54 kg</Text>
            </View>
            <View style={styles.weightIndicatorArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Goal</Text>
              <Text style={styles.weightValue}>58 kg</Text>
            </View>
          </View>

          {/* Progress Slider Bar */}
          <View style={styles.progressGaugeContainer}>
            <View style={styles.progressGaugeTrack}>
              <View style={[styles.progressGaugeFill, { width: '40%' }]} />
            </View>
            <Text style={styles.progressGaugeLabel}>40% of target weight gained</Text>
          </View>
        </Card>

        {/* Spacing for bottom tab bar */}
        <View style={{ height: 110 }} />
      </ScrollView>
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
    color: '#A8C7A7', // Light green
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '850' as any,
    color: colors.white, // White text for dark background
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.body,
    fontSize: 14,
    color: '#D1DDD6', // Light grayish green
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  adherenceCard: {
    padding: spacing.md + 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    letterSpacing: 0.8,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  percentageText: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
  },
  percentageUnit: {
    ...typography.caption,
    color: colors.text.light,
    marginLeft: 4,
    fontWeight: '700',
  },
  badgeSpark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 184, 75, 0.12)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 75, 0.25)',
    gap: 4,
  },
  sparkText: {
    ...typography.caption,
    color: '#8A6612',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 4,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
    width: 12,
    backgroundColor: '#EDF1EE',
    borderRadius: borderRadius.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.full,
  },
  barFillHighest: {
    backgroundColor: colors.primary,
  },
  barLabel: {
    ...typography.caption,
    color: colors.text.light,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  barLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  energyCard: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  energySubtitle: {
    ...typography.caption,
    color: colors.text.light,
    marginTop: 1,
    marginBottom: spacing.lg,
  },
  energyChartArea: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  energyChart: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  energyCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  energyLineTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#EDF1EE',
  },
  energyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
    position: 'absolute',
  },
  energyDotHigh: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#D5EAE2',
  },
  energyXLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  energyXText: {
    ...typography.caption,
    color: colors.text.light,
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2EB',
    padding: spacing.md - 2,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(40, 125, 75, 0.1)',
  },
  trendText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '500',
    flex: 1,
  },
  symptomsCard: {
    padding: spacing.md,
  },
  symptomList: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F2',
  },
  symptomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  symptomName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  symptomStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  symptomStatusText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  badgeSuccess: {
    backgroundColor: '#EAF2EB',
  },
  badgeSuccessText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  badgeError: {
    backgroundColor: '#FFF0F0',
  },
  badgeErrorText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
  },
  badgeNeutral: {
    backgroundColor: '#EDF1EE',
  },
  badgeNeutralText: {
    ...typography.caption,
    color: colors.text.light,
    fontWeight: '700',
  },
  weightCard: {
    padding: spacing.md,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E9EDE9',
  },
  weightItem: {
    alignItems: 'center',
  },
  weightLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  weightValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  weightIndicatorArrow: {
    opacity: 0.4,
  },
  arrowText: {
    fontSize: 20,
    color: colors.text.light,
  },
  progressGaugeContainer: {
    marginTop: spacing.sm,
  },
  progressGaugeTrack: {
    height: 8,
    backgroundColor: '#EDF1EE',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressGaugeFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressGaugeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

