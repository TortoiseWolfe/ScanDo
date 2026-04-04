import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontFamily, fontWeight, fontSize } from '@/theme/typography';

interface FeatureRow {
  label: string;
  free: boolean;
  pro: boolean;
}

const FEATURES: FeatureRow[] = [
  { label: 'LiDAR scanning', free: true, pro: true },
  { label: 'OBJ / DAE / STL export', free: true, pro: true },
  { label: 'Basic measurements', free: true, pro: true },
  { label: 'Up to 5 saved scans', free: true, pro: true },
  { label: 'Multi-scan stitching', free: false, pro: true },
  { label: 'Auto mesh cleanup', free: false, pro: true },
  { label: 'Floor plan generation', free: false, pro: true },
  { label: 'CAD-ready export (DWG, IFC)', free: false, pro: true },
  { label: 'Cloud backup & batch export', free: false, pro: true },
];

const PlanComparison: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Column headers */}
      <View style={styles.headerRow}>
        <View style={styles.labelCol} />
        <View style={styles.planCol}>
          <Text style={styles.freeTitle}>FREE</Text>
        </View>
        <View style={[styles.planCol, styles.proColHeader]}>
          <Text style={styles.proTitle}>PRO</Text>
        </View>
      </View>

      {/* Feature rows */}
      {FEATURES.map((feature, index) => (
        <View
          key={index}
          style={[
            styles.featureRow,
            index % 2 === 0 ? styles.featureRowEven : styles.featureRowOdd,
          ]}
        >
          <View style={styles.labelCol}>
            <Text style={styles.featureLabel}>{feature.label}</Text>
          </View>
          <View style={styles.planCol}>
            <Text style={feature.free ? styles.check : styles.cross}>
              {feature.free ? '\u2713' : '\u2717'}
            </Text>
          </View>
          <View style={[styles.planCol, styles.proColCell]}>
            <Text style={feature.pro ? styles.check : styles.cross}>
              {feature.pro ? '\u2713' : '\u2717'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    backgroundColor: colors.background.secondary,
  },
  labelCol: {
    flex: 2,
  },
  planCol: {
    flex: 1,
    alignItems: 'center',
  },
  proColHeader: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderRadius: 4,
    marginLeft: 4,
    paddingVertical: 2,
  },
  proColCell: {
    backgroundColor: 'rgba(251, 191, 36, 0.04)',
  },
  freeTitle: {
    color: colors.text.tertiary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  proTitle: {
    color: colors.subscription.pro,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  featureRowEven: {
    backgroundColor: colors.surface.default,
  },
  featureRowOdd: {
    backgroundColor: colors.background.tertiary,
  },
  featureLabel: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  check: {
    color: colors.accent.secondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
  },
  cross: {
    color: colors.text.tertiary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.mono,
    opacity: 0.5,
  },
});

export default PlanComparison;
