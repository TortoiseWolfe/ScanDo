import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontWeight } from '@/theme/typography';

interface CardProps {
  children: ReactNode;
  /** Optional accent color for a 3px left border */
  accent?: string;
  /** Optional header text rendered in small caps above content */
  header?: string;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, accent, header, style }) => {
  return (
    <View
      style={[
        styles.card,
        accent ? { borderLeftWidth: 3, borderLeftColor: accent } : undefined,
        style,
      ]}
    >
      {header && <Text style={styles.header}>{header}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
  },
  header: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
});

export default Card;
