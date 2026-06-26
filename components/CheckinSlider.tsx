import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface CheckinSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowEmoji?: string;
  highEmoji?: string;
  lowLabel?: string;
  highLabel?: string;
  color?: string;
}

export default function CheckinSlider({
  label,
  value,
  onChange,
  lowEmoji = '😞',
  highEmoji = '😊',
  lowLabel = 'Low',
  highLabel = 'High',
  color = colors.primary,
}: CheckinSliderProps) {
  const trackWidth = useRef(0);
  const trackPageX = useRef(0);
  const trackRef = useRef<View>(null);

  const computeValue = useCallback((pageX: number) => {
    const relative = pageX - trackPageX.current;
    const clamped = Math.max(0, Math.min(trackWidth.current, relative));
    return Math.round((clamped / trackWidth.current) * 10);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        onChange(computeValue(e.nativeEvent.pageX));
      },
      onPanResponderMove: (e) => {
        onChange(computeValue(e.nativeEvent.pageX));
      },
    })
  ).current;

  const onTrackLayout = useCallback((_e: LayoutChangeEvent) => {
    if (trackRef.current) {
      trackRef.current.measure((_x, _y, width, _height, pageX) => {
        trackWidth.current = width;
        trackPageX.current = pageX;
      });
    }
  }, []);

  const fillPercent = (value / 10) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.valueBadge, { backgroundColor: color + '22' }]}>
          <Text style={[styles.valueText, { color }]}>{value}/10</Text>
        </View>
      </View>

      <View style={styles.emojiRow}>
        <Text style={styles.emoji}>{lowEmoji}</Text>

        <View
          ref={trackRef}
          style={styles.trackWrap}
          onLayout={onTrackLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${fillPercent}%`, backgroundColor: color }]} />
          </View>
          <View
            style={[
              styles.thumb,
              {
                left: `${fillPercent}%`,
                borderColor: color,
                shadowColor: color,
              },
            ]}
          />
        </View>

        <Text style={styles.emoji}>{highEmoji}</Text>
      </View>

      <View style={styles.labelRowBottom}>
        <Text style={styles.rangeLabel}>{lowLabel}</Text>
        <Text style={styles.rangeLabel}>{highLabel}</Text>
      </View>

      <View style={styles.stepsRow}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
          <View
            key={d}
            style={[
              styles.step,
              d <= value && { backgroundColor: color },
              d === value && styles.stepActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  valueBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  valueText: {
    ...typography.small,
    fontWeight: '700',
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  trackWrap: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 10,
    backgroundColor: '#E4E6E2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 3,
    top: '50%',
    marginTop: -14,
    marginLeft: -14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  labelRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 30,
  },
  rangeLabel: {
    ...typography.caption,
    color: colors.text.light,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4E6E2',
  },
  stepActive: {
    transform: [{ scaleY: 1.5 }],
  },
});
