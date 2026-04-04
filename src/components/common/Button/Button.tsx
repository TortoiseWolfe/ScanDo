import React, { type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { fontWeight } from '@/theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'pro';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; bgPressed: string; text: string; border?: string }
> = {
  primary: {
    bg: colors.accent.secondary,
    bgPressed: colors.accent.secondaryDark,
    text: colors.text.inverse,
  },
  secondary: {
    bg: colors.surface.default,
    bgPressed: colors.surface.active,
    text: colors.text.primary,
  },
  outline: {
    bg: 'transparent',
    bgPressed: colors.surface.default,
    text: colors.accent.secondary,
    border: colors.accent.secondary,
  },
  danger: {
    bg: colors.semantic.error,
    bgPressed: '#DC2626',
    text: colors.text.primary,
  },
  pro: {
    bg: colors.subscription.pro,
    bgPressed: colors.subscription.proGradientEnd,
    text: colors.text.inverse,
  },
};

const SIZE_PADDING: Record<ButtonSize, { v: number; h: number; fs: number }> = {
  sm: { v: 6, h: 12, fs: 12 },
  md: { v: 12, h: 24, fs: 14 },
  lg: { v: 16, h: 32, fs: 16 },
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_PADDING[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed ? v.bgPressed : v.bg,
          paddingVertical: s.v,
          paddingHorizontal: s.h,
        },
        v.border ? { borderWidth: 1, borderColor: v.border } : undefined,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text
          style={[
            styles.text,
            { color: v.text, fontSize: s.fs },
            variant === 'outline' && { color: v.text },
          ]}
        >
          {loading ? '...' : title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrap: {
    marginRight: 2,
  },
  text: {
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
