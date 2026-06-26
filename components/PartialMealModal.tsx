import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Checkbox from '@/components/Checkbox';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface PartialMealModalProps {
  visible: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onClose: () => void;
  onSuccess: () => void;
}

const MEAL_ITEMS = {
  breakfast: [
    'Protein source (eggs, paneer, etc)',
    'Whole grain/millet bread',
    'Fruits',
    'Nuts/seeds',
    'Beverage (tea/coffee)',
  ],
  lunch: [
    'Vegetable curry',
    'Dal/legumes',
    'Rice/roti',
    'Salad',
    'Yogurt/raita',
  ],
  dinner: [
    'Vegetable dish',
    'Protein source',
    'Roti/rice',
    'Salad',
    'Soup',
  ],
};

export default function PartialMealModal({
  visible,
  mealType,
  onClose,
  onSuccess,
}: PartialMealModalProps) {
  const [missedItems, setMissedItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleItem = (item: string) => {
    setMissedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleSave = async () => {
    if (missedItems.length === 0) {
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('partial_meal_logs').insert({
        user_id: '00000000-0000-0000-0000-000000000001',
        meal_type: mealType,
        items_missed: missedItems,
        log_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error saving partial meal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setMissedItems([]);
    onClose();
  };

  const mealItems = MEAL_ITEMS[mealType] || [];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            What did you miss?
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.infoCard}>
            <Text style={styles.mealTypeText}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>
            <Text style={styles.instructionText}>
              Select the items you missed from your meal plan
            </Text>
          </Card>

          <View style={styles.itemsList}>
            {mealItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemRow}
                onPress={() => toggleItem(item)}
              >
                <Checkbox
                  checked={missedItems.includes(item)}
                  onValueChange={() => toggleItem(item)}
                />
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
            title={saving ? 'Saving...' : `Log ${missedItems.length} Missed`}
            onPress={handleSave}
            disabled={saving || missedItems.length === 0}
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
    backgroundColor: '#FFF8F0',
    marginBottom: spacing.lg,
  },
  mealTypeText: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  instructionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  itemsList: {
    gap: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
  itemText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.md,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
