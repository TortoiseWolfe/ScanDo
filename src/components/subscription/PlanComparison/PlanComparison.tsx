import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  { label: 'DWG / IFC / PLY / PDF export', free: false, pro: true },
  { label: 'Unlimited scan storage', free: false, pro: true },
  { label: 'High-res point clouds', free: false, pro: true },
  { label: 'Advanced measurements', free: false, pro: true },
  { label: 'Priority processing', free: false, pro: true },
];

const PlanComparison: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelCol} />
        <View style={styles.planCol}>
          <Text style={styles.planTitle}>Free</Text>
        </View>
        <View style={styles.planCol}>
          <Text style={[styles.planTitle, styles.proTitle]}>Pro</Text>
        </View>
      </View>

      {FEATURES.map((feature, index) => (
        <View
          key={index}
          style={[styles.featureRow, index % 2 === 0 && styles.featureRowAlt]}
        >
          <View style={styles.labelCol}>
            <Text style={styles.featureLabel}>{feature.label}</Text>
          </View>
          <View style={styles.planCol}>
            <Text style={feature.free ? styles.check : styles.cross}>
              {feature.free ? '\u2713' : '\u2717'}
            </Text>
          </View>
          <View style={styles.planCol}>
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
    backgroundColor: '#000',
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  labelCol: {
    flex: 2,
  },
  planCol: {
    flex: 1,
    alignItems: 'center',
  },
  planTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  proTitle: {
    color: '#0a7ea4',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  featureRowAlt: {
    backgroundColor: '#0a0a0a',
  },
  featureLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  check: {
    color: '#0a7ea4',
    fontSize: 18,
    fontWeight: '700',
  },
  cross: {
    color: '#555',
    fontSize: 18,
    fontWeight: '400',
  },
});

export default PlanComparison;
