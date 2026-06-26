import React from 'react';
import { View, StyleSheet, Text as RNText, useWindowDimensions } from 'react-native';
import Svg, { Path, G, Line, Circle, Text as SvgText } from 'react-native-svg';
import Card from './Card';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { BloodMarker } from '@/types/types';

interface BloodPanelSummaryChartProps {
  bloodPanelListMap: Record<string, BloodMarker[]>;
}

const INNER_COLORS = {
  GOOD: "#4CAF50",
  FAIR: "#FFA726",
  POOR: "#E53935",
};

const OUTER_COLORS = {
  OPTIMAL: "#81C784",
  HIGH: "#FF8A65",
  LOW: "#FFD54F",
};

const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const startOut = polarToCartesian(x, y, outerRadius, endAngle);
  const endOut = polarToCartesian(x, y, outerRadius, startAngle);
  const startIn = polarToCartesian(x, y, innerRadius, endAngle);
  const endIn = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";

  return [
    "M", startOut.x, startOut.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOut.x, endOut.y,
    "L", endIn.x, endIn.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startIn.x, startIn.y,
    "Z"
  ].join(" ");
};

export default function BloodPanelSummaryChart({ bloodPanelListMap }: BloodPanelSummaryChartProps) {
  const { width } = useWindowDimensions();
  // Responsive sizes
  const chartSize = Math.min(width - spacing.xl * 2 - spacing.md * 2, 300);
  const cx = chartSize / 2;
  const cy = chartSize / 2;
  
  const innerRadius = chartSize * 0.25;
  const outerRadiusInnerRing = chartSize * 0.35;
  const innerRadiusOuterRing = chartSize * 0.38;
  const outerRadius = chartSize * 0.48;

  const panels = Object.entries(bloodPanelListMap).map(([key, markers]) => {
    let panel = { name: key, healthScore: '', status: 'FAIR' };
    try {
      panel = JSON.parse(key);
    } catch (e) {}
    return { panel, markers };
  });

  const totalPanels = panels.length;
  const totalParameters = panels.reduce((sum, p) => sum + p.markers.length, 0);

  if (totalPanels === 0) return null;

  const paddingAngle = 2; // Degrees between panels
  const panelAngle = (360 - (totalPanels * paddingAngle)) / totalPanels;

  // Render elements
  const paths: React.ReactNode[] = [];
  const dividers: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  let currentAngle = 0;

  panels.forEach(({ panel, markers }, index) => {
    const startAngle = currentAngle;
    const endAngle = startAngle + panelAngle;

    // 1. Inner Ring (Panel Status)
    const statusColor = INNER_COLORS[panel.status?.toUpperCase() as keyof typeof INNER_COLORS] || INNER_COLORS.FAIR;
    paths.push(
      <Path
        key={`inner-${index}`}
        d={describeArc(cx, cy, innerRadius, outerRadiusInnerRing, startAngle, endAngle)}
        fill={statusColor}
        opacity={0.85}
      />
    );

    // 2. Outer Ring (Marker Results)
    const totalMarkers = markers.length;
    if (totalMarkers > 0) {
      const counts = { OPTIMAL: 0, HIGH: 0, LOW: 0, NORMAL: 0 };
      markers.forEach(m => counts[m.result as keyof typeof counts]++);
      counts.OPTIMAL += counts.NORMAL; // Merge normal into optimal

      let outerCurrentAngle = startAngle;
      
      const drawOuterSegment = (count: number, type: keyof typeof OUTER_COLORS) => {
        if (count === 0) return;
        const segmentAngle = (count / totalMarkers) * panelAngle;
        const segmentEnd = outerCurrentAngle + segmentAngle;
        paths.push(
          <Path
            key={`outer-${index}-${type}`}
            d={describeArc(cx, cy, innerRadiusOuterRing, outerRadius, outerCurrentAngle, segmentEnd)}
            fill={OUTER_COLORS[type]}
            opacity={0.85}
          />
        );
        outerCurrentAngle = segmentEnd;
      };

      drawOuterSegment(counts.OPTIMAL, 'OPTIMAL');
      drawOuterSegment(counts.LOW, 'LOW');
      drawOuterSegment(counts.HIGH, 'HIGH');
    }

    // 3. Divider Line (Draws in the padding space after the panel)
    const dividerAngle = endAngle + (paddingAngle / 2);
    const startDivider = polarToCartesian(cx, cy, innerRadius, dividerAngle);
    const endDivider = polarToCartesian(cx, cy, outerRadius + 10, dividerAngle);
    dividers.push(
      <Line
        key={`div-${index}`}
        x1={startDivider.x}
        y1={startDivider.y}
        x2={endDivider.x}
        y2={endDivider.y}
        stroke="#E2E8F0"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
    );

    // 4. Panel Label (Abbreviated or Icon approximation on the outside)
    const midAngle = startAngle + (panelAngle / 2);
    const labelPos = polarToCartesian(cx, cy, outerRadius + 20, midAngle);
    
    // Create a 2-letter abbreviation for the panel name
    const words = panel.name.split(' ');
    const abbr = words.length > 1 ? words[0][0] + words[1][0] : panel.name.substring(0, 2);

    labels.push(
      <View 
        key={`label-${index}`}
        style={[
          styles.labelBadge, 
          { 
            position: 'absolute', 
            left: labelPos.x - 12, 
            top: labelPos.y - 12,
            backgroundColor: statusColor + '20', // Light tint
            borderColor: statusColor + '50'
          }
        ]}
      >
        <RNText style={[styles.labelText, { color: statusColor }]}>{abbr.toUpperCase()}</RNText>
      </View>
    );

    currentAngle = endAngle + paddingAngle;
  });

  return (
    <Card variant="elevated" style={styles.card}>
      <RNText style={styles.title}>Blood Panel Summary</RNText>
      
      <View style={styles.chartContainer}>
        <View style={{ width: chartSize, height: chartSize }}>
          <Svg width={chartSize} height={chartSize}>
            {dividers}
            {paths}
          </Svg>
          
          {/* Center Text Overlaid via React Native absolute positioning */}
          <View style={styles.centerContent} pointerEvents="none">
            <RNText style={styles.centerTextValue}>{totalParameters}</RNText>
            <RNText style={styles.centerTextLabel}>parameters</RNText>
            <RNText style={styles.centerTextLabel}>across {totalPanels} panels</RNText>
          </View>
          
          {/* External Panel Labels Overlaid */}
          {labels}
        </View>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <RNText style={styles.legendTitle}>Panel Status:</RNText>
          {Object.entries(INNER_COLORS).map(([status, color]) => (
            <View key={`inner-${status}`} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <RNText style={styles.legendText}>{status}</RNText>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          <RNText style={styles.legendTitle}>Parameter:</RNText>
          {Object.entries(OUTER_COLORS).map(([status, color]) => (
            <View key={`outer-${status}`} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <RNText style={styles.legendText}>{status}</RNText>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: spacing.md,
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTextValue: {
    ...typography.h2,
    color: colors.text.primary,
  },
  centerTextLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  labelBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  labelText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: spacing.lg,
    backgroundColor: '#FAFBFA',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  legendTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text.primary,
    width: 80,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
  }
});
