import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import Svg, { Path, G, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors, typography } from '@/constants/theme';

interface GaugeChartProps {
  deviation: number;
  result: "OPTIMAL" | "HIGH" | "LOW" | "NORMAL";
  minValue: number;
  maxValue: number;
  units?: string;
}

const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  // SVG Y goes down, so we want 0 degrees to be right (3 o'clock) and 180 to be left (9 o'clock)
  // But we want to draw the top half, so angles should be negative in standard math, or just subtract from 360 if we do it standard.
  // Actually, standard SVG: 0 is right (x+, y=0). 180 is left (x-, y=0).
  // Top is -90 degrees (y-).
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
};

// Generates an SVG path for a donut slice
const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const startOut = polarToCartesian(x, y, outerRadius, endAngle);
  const endOut = polarToCartesian(x, y, outerRadius, startAngle);
  const startIn = polarToCartesian(x, y, innerRadius, endAngle);
  const endIn = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";

  const d = [
    "M", startOut.x, startOut.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOut.x, endOut.y,
    "L", endIn.x, endIn.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startIn.x, startIn.y,
    "Z"
  ].join(" ");

  return d;
};

export default function GaugeChart({
  deviation,
  result,
  minValue,
  maxValue,
  units,
}: GaugeChartProps) {
  const clampedDeviation = Math.min(Math.abs(deviation || 0), 100);
  
  const COLORS = {
    LOW: "#FFD54F",     // Yellow
    OPTIMAL: "#81C784", // Green
    HIGH: "#FF8A65"     // Red
  };

  const needleColor = (result === "OPTIMAL" || result === "NORMAL") ? "#4CAF50" : "#f44336";

  const chartWidth = 192;
  const chartHeight = 130;
  const cx = chartWidth / 2;
  const cy = 100;
  const gaugeInnerRadius = 40;
  const gaugeOuterRadius = 60;
  const needleCircleOuterRadius = 5;
  const needleCircleInnerRadius = 3;

  const formatValue = (value: number) => {
    if (value === 0) return "0";
    if (Math.abs(value) < 0.01) return value.toExponential(1);
    if (Math.abs(value) >= 1000) return value.toExponential(1);
    return value.toFixed(1);
  };

  const calculateNeedleAngle = () => {
    switch (result) {
      case "OPTIMAL":
      case "NORMAL":
        return -90; // Straight up (center)
      case "HIGH": {
        const baseAngle = -60; // Start of High section
        if (clampedDeviation === 0) return baseAngle;
        // Map 0-100% deviation to 0-60 degrees within the HIGH section (which goes from -60 to 0)
        return baseAngle + (clampedDeviation / 100) * 60;
      }
      case "LOW": {
        const baseAngle = -120; // Start of Low section
        if (clampedDeviation === 0) return baseAngle;
        // Map 0-100% deviation to 0-60 degrees within the LOW section (which goes from -180 to -120)
        return baseAngle - (clampedDeviation / 100) * 60;
      }
      default:
        return -90;
    }
  };

  const getBorderlineText = () => {
    if (clampedDeviation === 0) {
      if (result === "HIGH") return "Borderline High";
      if (result === "LOW") return "Borderline Low";
    } else {
      if (result === "HIGH") return "High";
      if (result === "LOW") return "Low";
    }
    return null;
  };

  const needleAngle = calculateNeedleAngle();
  
  // Calculate end of needle line
  const needleEnd = polarToCartesian(cx, cy, gaugeOuterRadius - 5, needleAngle);

  // Position for L O H text labels
  const lowTextPos = polarToCartesian(cx, cy, gaugeOuterRadius + 12, -150);
  const optTextPos = polarToCartesian(cx, cy, gaugeOuterRadius + 12, -90);
  const highTextPos = polarToCartesian(cx, cy, gaugeOuterRadius + 12, -30);

  // Position for min/max labels
  const leftEdge = cx - gaugeOuterRadius;
  const rightEdge = cx + gaugeOuterRadius;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Draw the 3 sections of the gauge */}
        {/* Note: SVG angles are clockwise. Top half is 180 (left) to 360 (right). Let's use negative angles. */}
        <Path d={describeArc(cx, cy, gaugeInnerRadius, gaugeOuterRadius, -180, -120)} fill={COLORS.LOW} />
        <Path d={describeArc(cx, cy, gaugeInnerRadius, gaugeOuterRadius, -120, -60)} fill={COLORS.OPTIMAL} />
        <Path d={describeArc(cx, cy, gaugeInnerRadius, gaugeOuterRadius, -60, 0)} fill={COLORS.HIGH} />

        {/* Min/Max values */}
        <SvgText x={leftEdge + 10} y={cy + 15} textAnchor="middle" fill="#666" fontSize="10" fontWeight="500">
          {formatValue(minValue)}
        </SvgText>
        <SvgText x={rightEdge - 10} y={cy + 15} textAnchor="middle" fill="#666" fontSize="10" fontWeight="500">
          {formatValue(maxValue)}
        </SvgText>

        {/* L O H labels */}
        <SvgText x={lowTextPos.x} y={lowTextPos.y + 4} textAnchor="middle" fill="#666" fontSize="12" fontWeight="bold">L</SvgText>
        <SvgText x={optTextPos.x} y={optTextPos.y + 4} textAnchor="middle" fill="#666" fontSize="12" fontWeight="bold">O</SvgText>
        <SvgText x={highTextPos.x} y={highTextPos.y + 4} textAnchor="middle" fill="#666" fontSize="12" fontWeight="bold">H</SvgText>

        {/* Needle */}
        <Line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke={needleColor} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={cx} cy={cy} r={needleCircleOuterRadius} fill={needleColor} />
        <Circle cx={cx} cy={cy} r={needleCircleInnerRadius} fill="#fff" />
      </Svg>
      
      <View style={styles.infoContainer}>
        <RNText style={styles.deviationText}>Deviation: {deviation.toFixed(1)}%</RNText>
        {getBorderlineText() && (
          <RNText style={styles.borderlineText}>{getBorderlineText()}</RNText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 192,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: -10,
  },
  deviationText: {
    ...typography.bodyMedium,
    color: '#666',
    fontWeight: '500',
  },
  borderlineText: {
    ...typography.caption,
    color: '#CA8A04',
    fontWeight: '600',
    marginTop: 2,
  }
});
