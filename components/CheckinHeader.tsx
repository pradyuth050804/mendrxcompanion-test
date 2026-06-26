import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface CheckinHeaderProps {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
}

const stepColors = ['#4A90D9', '#E8973A', '#6B8E6F', '#9B6DC5'];

export default function CheckinHeader({ title, subtitle, step, totalSteps }: CheckinHeaderProps) {
  const router = useRouter();
  const color = stepColors[step - 1] || colors.primary;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={24} color={colors.text.secondary} />
      </TouchableOpacity>

      <View style={styles.stepRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              i < step && { backgroundColor: color },
              i === step - 1 && styles.stepDotActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.stepLabel}>Step {step} of {totalSteps}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + 16,
    paddingBottom: spacing.lg,
  },
  backBtn: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    padding: 4,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EAECE8',
  },
  stepDotActive: {
    transform: [{ scaleY: 1.5 }],
  },
  stepLabel: {
    ...typography.caption,
    color: colors.text.light,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
