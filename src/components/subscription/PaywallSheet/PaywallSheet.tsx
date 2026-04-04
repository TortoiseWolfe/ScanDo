import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface PaywallSheetProps {
  feature: string;
  onSubscribe: () => void;
  onRestore: () => void;
}

const PRO_BENEFITS = [
  'Export to DWG, IFC, PLY, and PDF formats',
  'Unlimited scan storage',
  'High-resolution point clouds',
  'Advanced measurement tools',
  'Priority processing',
];

const PaywallSheet: React.FC<PaywallSheetProps> = ({
  feature,
  onSubscribe,
  onRestore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.handle} />

      <Text style={styles.title}>Upgrade to Pro</Text>
      <Text style={styles.subtitle}>
        <Text style={styles.featureHighlight}>{feature}</Text> requires a Pro
        subscription
      </Text>

      <View style={styles.benefitsList}>
        {PRO_BENEFITS.map((benefit, index) => (
          <View key={index} style={styles.benefitRow}>
            <Text style={styles.checkmark}>&#10003;</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.subscribeButton,
          pressed && styles.subscribeButtonPressed,
        ]}
        onPress={onSubscribe}
        accessibilityRole="button"
        accessibilityLabel="Subscribe to Pro"
      >
        <Text style={styles.subscribeText}>Subscribe</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.restoreButton,
          pressed && styles.restoreButtonPressed,
        ]}
        onPress={onRestore}
        accessibilityRole="button"
        accessibilityLabel="Restore purchases"
      >
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureHighlight: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  benefitsList: {
    marginBottom: 28,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
  benefitText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonPressed: {
    backgroundColor: '#086a8a',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonPressed: {
    opacity: 0.6,
  },
  restoreText: {
    color: '#0a7ea4',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default PaywallSheet;
