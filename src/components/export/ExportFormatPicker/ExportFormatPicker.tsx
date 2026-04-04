import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  isPro: boolean;
}

interface ExportFormatPickerProps {
  onSelect: (formatId: string) => void;
  proEnabled: boolean;
}

const FREE_FORMATS: ExportFormat[] = [
  {
    id: 'obj',
    name: 'OBJ',
    extension: '.obj',
    description: 'Wavefront 3D object format',
    isPro: false,
  },
  {
    id: 'dae',
    name: 'DAE',
    extension: '.dae',
    description: 'Collada digital asset exchange',
    isPro: false,
  },
  {
    id: 'stl',
    name: 'STL',
    extension: '.stl',
    description: 'Stereolithography mesh format',
    isPro: false,
  },
];

const PRO_FORMATS: ExportFormat[] = [
  {
    id: 'dwg',
    name: 'DWG',
    extension: '.dwg',
    description: 'AutoCAD drawing format',
    isPro: true,
  },
  {
    id: 'ifc',
    name: 'IFC',
    extension: '.ifc',
    description: 'Industry Foundation Classes (BIM)',
    isPro: true,
  },
  {
    id: 'ply',
    name: 'PLY',
    extension: '.ply',
    description: 'Polygon file with color data',
    isPro: true,
  },
  {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    description: '3D PDF document with measurements',
    isPro: true,
  },
  {
    id: 'kml',
    name: 'KML',
    extension: '.kml',
    description: 'Google Earth with real-world coordinates',
    isPro: true,
  },
  {
    id: 'geojson',
    name: 'GeoJSON',
    extension: '.geojson',
    description: 'GIS-compatible georeferenced mesh',
    isPro: true,
  },
];

/**
 * Lock icon built from Views: a small rectangle body with rounded top arch.
 */
function LockIcon() {
  return (
    <View style={lockStyles.container}>
      <View style={lockStyles.shackle} />
      <View style={lockStyles.body} />
    </View>
  );
}

const lockStyles = StyleSheet.create({
  container: {
    width: 12,
    height: 16,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  shackle: {
    width: 8,
    height: 6,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: colors.text.tertiary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  body: {
    width: 12,
    height: 9,
    backgroundColor: colors.text.tertiary,
    borderRadius: 1.5,
  },
});

const ExportFormatPicker: React.FC<ExportFormatPickerProps> = ({
  onSelect,
  proEnabled,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePress = (format: ExportFormat) => {
    if (format.isPro && !proEnabled) return;
    setSelectedId(format.id);
    onSelect(format.id);
  };

  const renderRow = (format: ExportFormat) => {
    const locked = format.isPro && !proEnabled;
    const isSelected = selectedId === format.id;

    return (
      <Pressable
        key={format.id}
        style={({ pressed }) => [
          styles.row,
          isSelected && styles.rowSelected,
          pressed && !locked && styles.rowPressed,
          locked && styles.rowLocked,
        ]}
        onPress={() => handlePress(format)}
        disabled={locked}
        accessibilityRole="button"
        accessibilityLabel={`${format.name} - ${format.description}${locked ? ', requires Pro subscription' : ''}`}
      >
        {/* Cyan left accent when selected */}
        {isSelected && <View style={styles.selectedAccent} />}

        {/* Format info */}
        <View style={styles.formatInfo}>
          <Text style={[styles.formatName, locked && styles.textLocked]}>
            {format.name}
          </Text>
          <Text style={[styles.formatDescription, locked && styles.textLocked]}>
            {format.description}
          </Text>
        </View>

        {/* Right side: extension badge + optional pro/lock */}
        <View style={styles.rightSide}>
          {format.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
          <View
            style={[
              styles.extensionBadge,
              locked && styles.extensionBadgeLocked,
            ]}
          >
            <Text
              style={[
                styles.extensionText,
                locked && styles.extensionTextLocked,
              ]}
            >
              {format.extension}
            </Text>
          </View>
          {locked && <LockIcon />}
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Free formats section */}
      <Text style={styles.sectionHeader}>FREE FORMATS</Text>
      {FREE_FORMATS.map(renderRow)}

      {/* Pro formats section */}
      <Text style={[styles.sectionHeader, styles.sectionHeaderPro]}>
        PRO FORMATS
      </Text>
      {PRO_FORMATS.map(renderRow)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  sectionHeaderPro: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.default,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
  },
  rowSelected: {
    backgroundColor: colors.surface.hover,
  },
  rowPressed: {
    backgroundColor: colors.surface.hover,
  },
  rowLocked: {
    opacity: 0.55,
  },
  selectedAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.accent.secondary,
  },
  formatInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  formatName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  formatDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: spacing.xxs,
    letterSpacing: 0.2,
  },
  textLocked: {
    color: colors.text.disabled,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  proBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  proBadgeText: {
    color: colors.subscription.pro,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  extensionBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
  },
  extensionBadgeLocked: {
    backgroundColor: colors.background.secondary,
  },
  extensionText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  extensionTextLocked: {
    color: colors.text.disabled,
  },
});

export default ExportFormatPicker;
