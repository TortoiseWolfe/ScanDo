import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontFamily, fontWeight, fontSize } from '@/theme/typography';

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
      {/* Drag handle */}
      <View style={styles.handle} />

      {/* Header */}
      <Text style={styles.title}>Unlock {feature}</Text>
      <Text style={styles.subtitle}>
        This feature requires a{' '}
        <Text style={styles.proHighlight}>ScanDo Pro</Text> subscription
      </Text>

      {/* Benefits list */}
      <View style={styles.benefitsList}>
        {PRO_BENEFITS.map((benefit, index) => (
          <View key={index} style={styles.benefitRow}>
            <Text style={styles.checkmark}>{'\u2713'}</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      {/* Pricing */}
      <View style={styles.pricingRow}>
        <Text style={styles.price}>$9.99</Text>
        <Text style={styles.pricePeriod}>/month</Text>
        <Text style={styles.priceDivider}>{'  |  '}</Text>
        <Text style={styles.price}>$79</Text>
        <Text style={styles.pricePeriod}> one-time</Text>
      </View>

      {/* Subscribe button */}
      <Pressable
        style={({ pressed }) => [
          styles.subscribeButton,
          pressed && styles.subscribeButtonPressed,
        ]}
        onPress={onSubscribe}
        accessibilityRole="button"
        accessibilityLabel="Subscribe to Pro"
      >
        <Text style={styles.subscribeText}>SUBSCRIBE</Text>
      </Pressable>

      {/* Restore link */}
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
    backgroundColor: colors.surface.default,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    borderTopWidth: 2,
    borderTopColor: colors.subscription.pro,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.default,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: fontSize.sm * 1.5,
  },
  proHighlight: {
    color: colors.subscription.pro,
    fontWeight: fontWeight.semibold,
  },
  benefitsList: {
    marginBottom: spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  checkmark: {
    color: colors.accent.secondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    marginRight: spacing.md,
    width: 20,
  },
  benefitText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: fontSize.sm * 1.5,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  price: {
    color: colors.text.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
  },
  pricePeriod: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  priceDivider: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
  },
  subscribeButton: {
    backgroundColor: colors.subscription.pro,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subscribeButtonPressed: {
    backgroundColor: colors.subscription.proGradientEnd,
  },
  subscribeText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  restoreButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  restoreButtonPressed: {
    opacity: 0.6,
  },
  restoreText: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});

export default PaywallSheet;
