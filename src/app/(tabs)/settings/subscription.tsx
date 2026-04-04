import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontFamily, fontWeight, fontSize } from '@/theme/typography';
import PlanComparison from '@/components/subscription/PlanComparison';
import { PRO_FEATURES } from '@/types/subscription';

export default function SubscriptionScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero header */}
      <View style={styles.heroSection}>
        <Text style={styles.heroLabel}>UPGRADE TO</Text>
        <Text style={styles.heroTitle}>SCANDO PRO</Text>
        <View style={styles.heroDivider} />
      </View>

      {/* Pricing cards */}
      <View style={styles.pricingRow}>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>MONTHLY</Text>
          <View style={styles.priceValueRow}>
            <Text style={styles.priceCurrency}>$</Text>
            <Text style={styles.priceAmount}>9.99</Text>
          </View>
          <Text style={styles.priceSuffix}>/month</Text>
        </View>

        <View style={styles.priceDividerVertical} />

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>LIFETIME</Text>
          <View style={styles.priceValueRow}>
            <Text style={styles.priceCurrency}>$</Text>
            <Text style={styles.priceAmount}>79</Text>
          </View>
          <Text style={styles.priceSuffix}>one-time</Text>
        </View>
      </View>

      {/* Pro features list */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresSectionTitle}>INCLUDED WITH PRO</Text>
        {PRO_FEATURES.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.featureCheck}>{'\u2713'}</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Plan comparison table */}
      <View style={styles.comparisonSection}>
        <Text style={styles.comparisonTitle}>PLAN COMPARISON</Text>
        <PlanComparison />
      </View>

      {/* Subscribe button */}
      <View style={styles.ctaSection}>
        <Pressable
          style={({ pressed }) => [
            styles.subscribeButton,
            pressed && styles.subscribeButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Subscribe to ScanDo Pro"
        >
          <Text style={styles.subscribeText}>SUBSCRIBE</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.restoreButton,
            pressed && styles.restoreButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Restore purchases"
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },

  /* Hero */
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  heroLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    fontFamily: fontFamily.mono,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.heavy,
    color: colors.subscription.pro,
    fontFamily: fontFamily.mono,
    letterSpacing: 4,
  },
  heroDivider: {
    width: 48,
    height: 2,
    backgroundColor: colors.subscription.pro,
    marginTop: spacing.lg,
    borderRadius: 1,
    opacity: 0.6,
  },

  /* Pricing */
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingVertical: spacing.xl,
  },
  priceCard: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    fontFamily: fontFamily.mono,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceCurrency: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.subscription.pro,
    fontFamily: fontFamily.mono,
    marginTop: 4,
    marginRight: 2,
  },
  priceAmount: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    fontFamily: fontFamily.mono,
  },
  priceSuffix: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.text.tertiary,
    fontFamily: fontFamily.mono,
    marginTop: spacing.xs,
  },
  priceDividerVertical: {
    width: 1,
    height: 60,
    backgroundColor: colors.border.default,
  },

  /* Pro features list */
  featuresSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  featuresSectionTitle: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    fontFamily: fontFamily.mono,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingLeft: spacing.xs,
  },
  featureCheck: {
    color: colors.accent.secondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    marginRight: spacing.md,
    width: 20,
  },
  featureText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    flex: 1,
    lineHeight: fontSize.sm * 1.5,
  },

  /* Comparison */
  comparisonSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  comparisonTitle: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    fontFamily: fontFamily.mono,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },

  /* CTA */
  ctaSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
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
    fontFamily: fontFamily.mono,
    letterSpacing: 2,
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
