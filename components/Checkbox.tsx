import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, borderRadius, spacing } from '@/constants/theme';

interface CheckboxProps {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  size?: number;
  disabled?: boolean;
}

export default function Checkbox({ checked, onValueChange, size = 24, disabled }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size },
        checked && styles.checked,
        disabled && styles.disabled,
      ]}
      onPress={() => !disabled && onValueChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {checked && (
        <Check size={size * 0.7} color={colors.white} strokeWidth={3} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
