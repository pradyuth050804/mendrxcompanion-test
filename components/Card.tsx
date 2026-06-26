import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
  variant?: 'flat' | 'elevated' | 'outlined' | 'glass';
}

export default function Card({ children, style, noPadding, variant = 'elevated' }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        styles[variant],
        noPadding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  elevated: {
    backgroundColor: colors.card,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border, // Use the darker border defined in theme
  },
  flat: {
    backgroundColor: colors.primaryLight,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...shadows.sm,
  },
  noPadding: {
    padding: 0,
  },
});

