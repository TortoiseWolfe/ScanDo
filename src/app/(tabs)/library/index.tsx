import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_SCANS } from '@/utils/mockData';
import ScanList from '@/components/library/ScanList';
import type { ScanItem } from '@/components/library/ScanList/ScanList';
import { formatFileSize, formatDate, formatNumber } from '@/utils/format';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function LibraryScreen() {
  const router = useRouter();

  // Compute summary stats
  const totalVertices = MOCK_SCANS.reduce((sum, s) => sum + s.vertexCount, 0);
  const totalSize = MOCK_SCANS.reduce((sum, s) => sum + s.fileSize, 0);

  // Map mock data to ScanItem shape
  const scans: ScanItem[] = MOCK_SCANS.map((scan) => ({
    id: scan.id,
    scanName: scan.name,
    date: formatDate(scan.createdAt),
    fileSize: formatFileSize(scan.fileSize),
    vertexCount: formatNumber(scan.vertexCount),
  }));

  const handleSelectScan = (scanId: string) => {
    router.push(`/library/${scanId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>SCAN LIBRARY</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{MOCK_SCANS.length}</Text>
          </View>
        </View>

        {/* Summary strip */}
        {MOCK_SCANS.length > 0 ? (
          <Text style={styles.summaryStrip}>
            {MOCK_SCANS.length} SCANS{'  \u00B7  '}
            {(totalVertices / 1000).toFixed(1)}K VERTICES{'  \u00B7  '}
            {formatFileSize(totalSize)}
          </Text>
        ) : null}
      </View>

      {/* Scan list or empty state */}
      {MOCK_SCANS.length === 0 ? (
        <View style={styles.emptyState}>
          {/* Crosshair icon */}
          <View style={styles.crosshairRing}>
            <View style={styles.crosshairDot} />
          </View>
          <View style={styles.crosshairLineH} />
          <View style={styles.crosshairLineV} />
          <Text style={styles.emptyText}>No scans captured</Text>
        </View>
      ) : (
        <ScanList scans={scans} onSelectScan={handleSelectScan} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  countBadge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.accent.secondary,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    minWidth: 22,
    alignItems: 'center',
  },
  countText: {
    color: colors.text.inverse,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  summaryStrip: {
    color: colors.accent.secondary,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  crosshairDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent.secondary,
  },
  crosshairLineH: {
    position: 'absolute',
    width: 60,
    height: 1,
    backgroundColor: colors.text.tertiary,
    opacity: 0.2,
    top: '50%',
  },
  crosshairLineV: {
    position: 'absolute',
    width: 1,
    height: 60,
    backgroundColor: colors.text.tertiary,
    opacity: 0.2,
    left: '50%',
  },
  emptyText: {
    color: colors.text.tertiary,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
