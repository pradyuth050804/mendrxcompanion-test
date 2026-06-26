import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { CompanionReport } from '@/types/types';
import { Calendar, User, Scale, Activity } from 'lucide-react-native';

interface ReportSummaryCardProps {
  report: CompanionReport;
}

export default function ReportSummaryCard({ report }: ReportSummaryCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatEnum = (val: string) => {
    return val.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Profile</Text>
        <View style={styles.dateBadge}>
          <Calendar size={12} color={colors.primary} />
          <Text style={styles.dateText}>{formatDate(report.reportDate)}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        {report.height !== null && report.height !== undefined && (
          <View style={styles.metricItem}>
            <View style={styles.metricIconBox}>
              <User size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.metricLabel}>Height</Text>
              <Text style={styles.metricValue}>{report.height} cm</Text>
            </View>
          </View>
        )}
        
        {report.weight !== null && report.weight !== undefined && (
          <View style={styles.metricItem}>
            <View style={styles.metricIconBox}>
              <Scale size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.metricLabel}>Weight</Text>
              <Text style={styles.metricValue}>{report.weight} kg</Text>
            </View>
          </View>
        )}

        {report.waist !== null && report.waist !== undefined && (
          <View style={styles.metricItem}>
            <View style={styles.metricIconBox}>
              <Activity size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.metricLabel}>Waist</Text>
              <Text style={styles.metricValue}>{report.waist} in</Text>
            </View>
          </View>
        )}

        {report.bmi !== null && report.bmi !== undefined && (
          <View style={styles.metricItem}>
            <View style={styles.metricIconBox}>
              <Activity size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.metricLabel}>BMI</Text>
              <Text style={styles.metricValue}>{report.bmi.toFixed(1)}</Text>
            </View>
          </View>
        )}
      </View>

      {report.diet && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet Preference</Text>
          <View style={styles.chipContainer}>
            <View style={[styles.chip, styles.chipPrimary]}>
              <Text style={styles.chipPrimaryText}>{formatEnum(report.diet)}</Text>
            </View>
          </View>
        </View>
      )}

      {report.lifestyleHabits && report.lifestyleHabits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle Habits</Text>
          <View style={styles.chipContainer}>
            {report.lifestyleHabits.map((habit, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{formatEnum(habit)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {report.existingConditions && report.existingConditions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existing Conditions</Text>
          <View style={styles.chipContainer}>
            {report.existingConditions.map((condition, idx) => (
              <View key={idx} style={[styles.chip, styles.chipWarning]}>
                <Text style={styles.chipWarningText}>{formatEnum(condition)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF1EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  dateText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    gap: spacing.sm,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  metricValue: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F2F5F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  chipText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '500',
  },
  chipPrimary: {
    backgroundColor: '#EAF2EB',
    borderWidth: 1,
    borderColor: 'rgba(40, 125, 75, 0.1)',
  },
  chipPrimaryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  chipWarning: {
    backgroundColor: '#FFF8E6',
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 75, 0.2)',
  },
  chipWarningText: {
    ...typography.caption,
    color: '#B2821D',
    fontWeight: '500',
  },
});
