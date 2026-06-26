import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Checkbox from '@/components/Checkbox';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Supplement {
  id: string;
  supplement_name: string;
  dosage: string;
  time_of_day: string;
}

interface SupplementTrackingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SupplementTrackingModal({
  visible,
  onClose,
  onSuccess,
}: SupplementTrackingModalProps) {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [missedSupplements, setMissedSupplements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchSupplements();
    }
  }, [visible]);

  const fetchSupplements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('suggested_supplements')
        .select('*')
        .eq('user_id', '00000000-0000-0000-0000-000000000001')
        .eq('is_active', true)
        .order('time_of_day');

      if (error) throw error;
      setSupplements(data || []);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSupplement = (supplementName: string) => {
    setMissedSupplements((prev) =>
      prev.includes(supplementName)
        ? prev.filter((s) => s !== supplementName)
        : [...prev, supplementName]
    );
  };

  const handleSave = async () => {
    if (missedSupplements.length === 0) {
      return;
    }

    setSaving(true);
    try {
      const logs = missedSupplements.map((name) => {
        const supplement = supplements.find((s) => s.supplement_name === name);
        return {
          user_id: '00000000-0000-0000-0000-000000000001',
          supplement_name: name,
          was_taken: false,
          time_of_day: supplement?.time_of_day || 'morning',
          log_date: new Date().toISOString().split('T')[0],
        };
      });

      const { error } = await supabase.from('supplement_logs').insert(logs);

      if (error) throw error;

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error saving supplement logs:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setMissedSupplements([]);
    onClose();
  };

  const groupedSupplements = supplements.reduce((acc, supplement) => {
    const timeGroup = supplement.time_of_day;
    if (!acc[timeGroup]) {
      acc[timeGroup] = [];
    }
    acc[timeGroup].push(supplement);
    return acc;
  }, {} as Record<string, Supplement[]>);

  const timeOrder = ['morning', 'afternoon', 'evening', 'night'];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Supplements Missed</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.infoCard}>
            <Text style={styles.instructionText}>
              Select the supplements you missed today
            </Text>
          </Card>

          {loading ? (
            <Card>
              <Text style={styles.loadingText}>Loading supplements...</Text>
            </Card>
          ) : supplements.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>No supplements found</Text>
              <Text style={styles.emptySubtext}>
                Your practitioner will add supplements to your plan
              </Text>
            </Card>
          ) : (
            timeOrder
              .filter((time) => groupedSupplements[time])
              .map((timeGroup) => (
                <View key={timeGroup} style={styles.timeGroup}>
                  <Text style={styles.timeGroupTitle}>
                    {timeGroup.charAt(0).toUpperCase() + timeGroup.slice(1)}
                  </Text>
                  <View style={styles.supplementsList}>
                    {groupedSupplements[timeGroup].map((supplement) => (
                      <TouchableOpacity
                        key={supplement.id}
                        style={styles.supplementRow}
                        onPress={() => toggleSupplement(supplement.supplement_name)}
                      >
                        <Checkbox
                          checked={missedSupplements.includes(supplement.supplement_name)}
                          onValueChange={() => toggleSupplement(supplement.supplement_name)}
                        />
                        <View style={styles.supplementInfo}>
                          <Text style={styles.supplementName}>
                            {supplement.supplement_name}
                          </Text>
                          {supplement.dosage && (
                            <Text style={styles.supplementDosage}>
                              {supplement.dosage}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={handleClose}
            variant="outline"
            style={{ flex: 1 }}
          />
          <View style={{ width: spacing.md }} />
          <Button
            title={saving ? 'Saving...' : `Log ${missedSupplements.length} Missed`}
            onPress={handleSave}
            disabled={saving || missedSupplements.length === 0}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  infoCard: {
    backgroundColor: '#F0F7FF',
    marginBottom: spacing.lg,
  },
  instructionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.small,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  timeGroup: {
    marginBottom: spacing.lg,
  },
  timeGroupTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  supplementsList: {
    gap: spacing.sm,
  },
  supplementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
  supplementInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  supplementName: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  supplementDosage: {
    ...typography.small,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
