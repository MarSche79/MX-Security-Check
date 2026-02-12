import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { SecurityScore as SecurityScoreType } from '../types';

const { width } = Dimensions.get('window');

interface SecurityScoreProps {
  score: SecurityScoreType;
}

export const SecurityScoreGauge: React.FC<SecurityScoreProps> = ({ score }) => {
  const size = Math.min(width * 0.45, 180);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score.total / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={size}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.surfaceLight}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={score.gradeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={[styles.scoreOverlay, { width: size, height: size }]}>
          <Text style={[styles.gradeText, { color: score.gradeColor }]}>
            {score.grade}
          </Text>
          <Text style={styles.scoreNumber}>{score.total}</Text>
          <Text style={styles.scoreLabel}>/ 100</Text>
        </View>
      </View>

      {/* Score Breakdown */}
      <View style={styles.breakdownContainer}>
        {score.details.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailIcon}>{detail.icon}</Text>
              <Text style={styles.detailCategory}>{detail.category}</Text>
            </View>
            <View style={styles.detailRight}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      detail.status === 'pass'
                        ? colors.success
                        : detail.status === 'warn'
                          ? colors.warning
                          : colors.error,
                  },
                ]}
              />
              <Text style={styles.detailPoints}>
                {detail.points}/{detail.maxPoints}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: -2,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  breakdownContainer: {
    width: '100%',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailCategory: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailPoints: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});
