import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  useSettingsStore,
  type ExportQuality,
  type MeasurementUnit,
} from '@/stores/useSettingsStore';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontFamily, fontWeight, fontSize } from '@/theme/typography';

/* ------------------------------------------------------------------ */
/*  Custom toggle                                                      */
/* ------------------------------------------------------------------ */

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={[styles.toggleTrack, value && styles.toggleTrackOn]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/*  Selector chips                                                     */
/* ------------------------------------------------------------------ */

function ChipSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[styles.chip, opt.value === value && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              opt.value === value && styles.chipTextActive,
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Setting row                                                        */
/* ------------------------------------------------------------------ */

function SettingRow({
  label,
  children,
  onPress,
  style,
}: {
  label: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      {...(onPress ? { onPress } : {})}
      style={[styles.settingRow, style] as ViewStyle[]}
    >
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingControl}>{children}</View>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

export default function SettingsScreen() {
  const router = useRouter();
  const {
    hapticFeedback,
    autoSave,
    exportQuality,
    measurementUnit,
    toggleHapticFeedback,
    toggleAutoSave,
    setExportQuality,
    setMeasurementUnit,
  } = useSettingsStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SCANNING */}
      <SectionHeader title="SCANNING" />
      <View style={styles.section}>
        <SettingRow label="Haptic Feedback">
          <Toggle value={hapticFeedback} onToggle={toggleHapticFeedback} />
        </SettingRow>
        <SettingRow label="Auto-Save Scans" style={styles.lastRow}>
          <Toggle value={autoSave} onToggle={toggleAutoSave} />
        </SettingRow>
      </View>

      {/* EXPORT */}
      <SectionHeader title="EXPORT" />
      <View style={styles.section}>
        <SettingRow label="Export Quality">
          <ChipSelector<ExportQuality>
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]}
            value={exportQuality}
            onChange={setExportQuality}
          />
        </SettingRow>
        <SettingRow label="Measurement Units" style={styles.lastRow}>
          <ChipSelector<MeasurementUnit>
            options={[
              { label: 'Metric', value: 'metric' },
              { label: 'Imperial', value: 'imperial' },
            ]}
            value={measurementUnit}
            onChange={setMeasurementUnit}
          />
        </SettingRow>
      </View>

      {/* ACCOUNT */}
      <SectionHeader title="ACCOUNT" />
      <View style={styles.section}>
        <SettingRow
          label="Subscription"
          onPress={() => router.push('/(tabs)/settings/subscription')}
        >
          <View style={styles.badgeRow}>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
            <Text style={styles.chevron}>{'\u203A'}</Text>
          </View>
        </SettingRow>
        <SettingRow label="Cloud Backup" style={styles.lastRow}>
          <Text style={styles.requiresPro}>Requires Pro</Text>
        </SettingRow>
      </View>

      {/* ABOUT */}
      <SectionHeader title="ABOUT" />
      <View style={styles.section}>
        <SettingRow label="Version">
          <Text style={styles.infoValue}>0.1.0</Text>
        </SettingRow>
        <SettingRow label="Device">
          <Text style={styles.infoValue}>Web Preview</Text>
        </SettingRow>
        <SettingRow label="Build" style={styles.lastRow}>
          <Text style={styles.infoValue}>Development</Text>
        </SettingRow>
      </View>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  /* Section header */
  sectionHeader: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingLeft: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    fontFamily: fontFamily.mono,
  },

  /* Section card wrapper */
  section: {
    backgroundColor: colors.surface.default,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },

  /* Setting row */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    minHeight: 52,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    flex: 1,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Toggle */
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: colors.accent.secondaryDark,
    borderColor: colors.accent.secondary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.tertiary,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent.secondary,
  },

  /* Chip selector */
  chipRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chipActive: {
    backgroundColor: colors.accent.secondaryDark,
    borderColor: colors.accent.secondary,
  },
  chipText: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: fontFamily.mono,
  },
  chipTextActive: {
    color: colors.accent.secondary,
  },

  /* Badge */
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  freeBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.text.tertiary,
  },
  freeBadgeText: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.bold,
    color: colors.text.tertiary,
    fontFamily: fontFamily.mono,
    letterSpacing: 1,
  },
  chevron: {
    fontSize: fontSize.lg,
    color: colors.text.tertiary,
    fontWeight: fontWeight.regular,
  },

  /* Pro label */
  requiresPro: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.subscription.pro,
    fontFamily: fontFamily.mono,
    letterSpacing: 0.5,
  },

  /* Info values */
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: colors.text.secondary,
    fontFamily: fontFamily.mono,
  },
});
