import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { colors, spacing, typography } from '@/constants/theme';

export default function PractitionerScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleContinue = () => {
    router.push('/onboarding/health-snapshot');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Link with your practitioner</Text>
        <Text style={styles.subtitle}>
          Enter the practitioner code provided to you, or skip to use demo account
        </Text>

        <Input
          label="Practitioner Code"
          value={code}
          onChangeText={setCode}
          placeholder="Enter code"
          autoCapitalize="characters"
        />

        <Button
          title={code ? 'Link & Continue' : 'Skip for now'}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
});
