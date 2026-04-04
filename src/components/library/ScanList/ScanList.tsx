import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ScanCard from '../ScanCard';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

export interface ScanItem {
  id: string;
  scanName: string;
  date: string;
  fileSize: string;
  vertexCount: string;
}

interface ScanListProps {
  scans: ScanItem[];
  onSelectScan: (scanId: string) => void;
}

/**
 * Crosshair / reticle empty-state icon built from Views.
 */
function CrosshairIcon() {
  return (
    <View style={reticleStyles.container}>
      {/* Outer ring */}
      <View style={reticleStyles.ring}>
        {/* Center dot */}
        <View style={reticleStyles.dot} />
      </View>
      {/* Crosshair lines */}
      <View style={reticleStyles.lineH} />
      <View style={reticleStyles.lineV} />
      {/* Corner brackets */}
      <View style={[reticleStyles.bracket, reticleStyles.bracketTL]} />
      <View style={[reticleStyles.bracket, reticleStyles.bracketTR]} />
      <View style={[reticleStyles.bracket, reticleStyles.bracketBL]} />
      <View style={[reticleStyles.bracket, reticleStyles.bracketBR]} />
    </View>
  );
}

const reticleStyles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  ring: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.secondary,
  },
  lineH: {
    position: 'absolute',
    width: 56,
    height: 1,
    backgroundColor: colors.text.tertiary,
    opacity: 0.3,
  },
  lineV: {
    position: 'absolute',
    width: 1,
    height: 56,
    backgroundColor: colors.text.tertiary,
    opacity: 0.3,
  },
  bracket: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: colors.text.tertiary,
  },
  bracketTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  bracketTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

function ItemSeparator() {
  return <View style={styles.separator} />;
}

const ScanList: React.FC<ScanListProps> = ({ scans, onSelectScan }) => {
  if (scans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CrosshairIcon />
        <Text style={styles.emptyTitle}>No scans yet</Text>
        <Text style={styles.emptySubtitle}>Start your first scan</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={scans}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ScanCard
          scanName={item.scanName}
          date={item.date}
          fileSize={item.fileSize}
          vertexCount={item.vertexCount}
          onPress={() => onSelectScan(item.id)}
        />
      )}
      ItemSeparatorComponent={ItemSeparator}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    color: colors.text.tertiary,
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default ScanList;
