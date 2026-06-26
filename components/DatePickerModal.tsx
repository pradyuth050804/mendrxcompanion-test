import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  maxDate?: Date;
}

export default function DatePickerModal({ visible, onClose, selectedDate, onSelectDate, maxDate }: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    if (visible) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [visible, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    const padDays = Array(firstDay).fill(null);
    const monthDays = Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    
    return [...padDays, ...monthDays];
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Select Date</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.monthSelector}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
                  <ChevronLeft size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
                  <ChevronRight size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.calendar}>
                <View style={styles.weekDaysRow}>
                  {weekDays.map(day => (
                    <Text key={day} style={styles.weekDayText}>{day}</Text>
                  ))}
                </View>
                
                <View style={styles.daysGrid}>
                  {daysInMonth.map((date, index) => {
                    if (!date) {
                      return <View key={`pad-${index}`} style={styles.dayCell} />;
                    }
                    
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    // Normalize dates to start of day for comparison
                    const isFuture = maxDate && (new Date(date).setHours(0,0,0,0) > new Date(maxDate).setHours(0,0,0,0));
                    
                    return (
                      <TouchableOpacity
                        key={date.toISOString()}
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellSelected,
                          isToday && !isSelected && styles.dayCellToday
                        ]}
                        disabled={isFuture}
                        onPress={() => {
                          onSelectDate(date);
                          onClose();
                        }}
                      >
                        <Text style={[
                          styles.dayText,
                          isSelected && styles.dayTextSelected,
                          isToday && !isSelected && styles.dayTextToday,
                          isFuture && styles.dayTextDisabled
                        ]}>
                          {date.getDate()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 360,
    padding: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontWeight: '700',
  },
  arrowBtn: {
    padding: spacing.xs,
    backgroundColor: '#F2F5F2',
    borderRadius: borderRadius.md,
  },
  calendar: {
    marginTop: spacing.sm,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  dayText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '700',
  },
  dayTextDisabled: {
    color: colors.text.light,
    opacity: 0.3,
  },
});
