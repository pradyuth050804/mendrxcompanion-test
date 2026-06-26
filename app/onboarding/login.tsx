import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { findClientByName } from '@/services/clientService';
import { fetchMyPlan, fetchMyReport } from '@/services/companionService';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const setClient = useStore((state) => state.setClient);
  const setSndPlan = useStore((state) => state.setSndPlan);
  const setCompanionReport = useStore((state) => state.setCompanionReport);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid =
    name.trim().length > 0 &&
    age.length > 0 &&
    Number(age) > 0 &&
    Number(age) < 150;

  const handleContinue = async () => {
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      // 1. Look up the client by name in Supabase
      const client = await findClientByName(name.trim());

      if (!client) {
        setError('No patient found with that name. Please check and try again.');
        setLoading(false);
        return;
      }

      // 2. Store the client in Zustand
      setClient(client);

      // 3. Also set the user object for compatibility with existing screens
      setUser({
        id: client.id,
        phone_number: client.phone_number || '',
        name: client.name,
        age: Number(age),
        subscription_status: 'active',
        program_start_date: new Date().toISOString(),
        program_end_date: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      // 4. Fetch the full SnD plan from the Spring Boot backend (best-effort, don't block navigation)
      try {
        const identifier = client.phone_number || client.name;
        const sndPlan = await fetchMyPlan(identifier);
        if (sndPlan) {
          setSndPlan(sndPlan);
        }
        
        const report = await fetchMyReport(identifier);
        if (report) {
          setCompanionReport(report);
        }
      } catch (dataError) {
        console.warn('Could not fetch companion data:', dataError);
      }

      // 5. Navigate to health snapshot
      router.push('/onboarding/health-snapshot');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FAF9F6', '#FAF9F6', '#EAF2EB']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.appName}>MendRx</Text>
            <Text style={styles.title}>Let's find your profile</Text>
            <Text style={styles.subtitle}>
              Enter your clinical registration details to access your practitioner-prescribed protocols.
            </Text>
          </View>

          <Card variant="elevated" style={styles.card}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              placeholder="e.g. Priya Sharma"
              editable={!loading}
              autoCapitalize="words"
            />
            <Input
              label="Age"
              value={age}
              onChangeText={(text) => {
                setAge(text.replace(/[^0-9]/g, ''));
                setError('');
              }}
              keyboardType="number-pad"
              maxLength={3}
              placeholder="e.g. 28"
              editable={!loading}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!isValid || loading}
              loading={loading}
              style={styles.button}
            />
          </Card>

          <View style={styles.securityWrapper}>
            <ShieldCheck size={16} color={colors.text.light} />
            <Text style={styles.securityText}>
              Prescription security & HIPAA privacy protected.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 1.5 : spacing.xxl,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  appName: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 23,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  securityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    opacity: 0.8,
  },
  securityText: {
    ...typography.caption,
    color: colors.text.light,
  },
});

