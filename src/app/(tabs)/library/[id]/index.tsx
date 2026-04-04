import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_SCANS } from '@/utils/mockData';
import {
  formatFileSize,
  formatDuration,
  formatDate,
  formatNumber,
} from '@/utils/format';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

interface StatCardData {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardData) {
  return (
    <View style={statStyles.card}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    margin: spacing.xs,
  },
  value: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

/**
 * Cyan wireframe box placeholder for mesh visualization.
 */
function MeshPlaceholder() {
  return (
    <View style={meshStyles.container}>
      {/* Back face */}
      <View style={meshStyles.backFace} />
      {/* Front face */}
      <View style={meshStyles.frontFace} />
      {/* Connecting edges */}
      <View style={[meshStyles.edge, meshStyles.edgeTL]} />
      <View style={[meshStyles.edge, meshStyles.edgeTR]} />
      <View style={[meshStyles.edge, meshStyles.edgeBL]} />
      <View style={[meshStyles.edge, meshStyles.edgeBR]} />
      {/* Grid overlay lines */}
      <View style={meshStyles.gridH} />
      <View style={meshStyles.gridV} />
    </View>
  );
}

const meshStyles = StyleSheet.create({
  container: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    overflow: 'hidden',
  },
  backFace: {
    position: 'absolute',
    width: 80,
    height: 60,
    borderWidth: 1,
    borderColor: colors.accent.secondaryDark,
    top: 40,
    left: '30%',
    opacity: 0.4,
  },
  frontFace: {
    width: 100,
    height: 72,
    borderWidth: 1.5,
    borderColor: colors.accent.secondary,
  },
  edgeTL: { top: 40, left: '30%' },
  edgeTR: { top: 40, right: '30%' },
  edgeBL: { bottom: 40, left: '30%' },
  edgeBR: { bottom: 40, right: '30%' },
  edge: {
    position: 'absolute',
    width: 20,
    height: 1,
    backgroundColor: colors.accent.secondaryDark,
    opacity: 0.3,
    transform: [{ rotate: '-30deg' }],
  },
  gridH: {
    position: 'absolute',
    width: '80%',
    height: 1,
    backgroundColor: colors.accent.secondaryDark,
    opacity: 0.1,
  },
  gridV: {
    position: 'absolute',
    width: 1,
    height: '80%',
    backgroundColor: colors.accent.secondaryDark,
    opacity: 0.1,
  },
});

export default function LibraryScanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scan = MOCK_SCANS.find((s) => s.id === id);

  if (!scan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Scan not found</Text>
      </View>
    );
  }

  const stats: StatCardData[] = [
    { label: 'Vertices', value: formatNumber(scan.vertexCount) },
    { label: 'Faces', value: formatNumber(scan.faceCount) },
    { label: 'File Size', value: formatFileSize(scan.fileSize) },
    { label: 'Duration', value: formatDuration(scan.duration) },
    { label: 'Date', value: formatDate(scan.createdAt) },
    {
      label: 'GPS',
      value: scan.geoLocation
        ? `${scan.geoLocation.latitude.toFixed(3)}, ${scan.geoLocation.longitude.toFixed(3)}`
        : 'N/A',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Scan title */}
      <Text style={styles.scanName}>{scan.name}</Text>

      {/* Mesh visualization placeholder */}
      <MeshPlaceholder />

      {/* Stats grid: 2 columns */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={styles.statCol}>
            <StatCard label={stat.label} value={stat.value} />
          </View>
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.exportBtn,
            pressed && styles.exportBtnPressed,
          ]}
          onPress={() => router.push(`/library/${id}/export`)}
          accessibilityRole="button"
          accessibilityLabel="Export scan"
        >
          <Text style={styles.exportBtnText}>EXPORT</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.deleteBtn,
            pressed && styles.deleteBtnPressed,
          ]}
          onPress={() => {
            /* Delete not implemented */
          }}
          accessibilityRole="button"
          accessibilityLabel="Delete scan"
        >
          <Text style={styles.deleteBtnText}>DELETE</Text>
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
  scanName: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  statCol: {
    width: '50%',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtn: {
    backgroundColor: colors.accent.secondary,
  },
  exportBtnPressed: {
    backgroundColor: colors.accent.secondaryDark,
  },
  exportBtnText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  deleteBtn: {
    borderWidth: 1.5,
    borderColor: colors.semantic.error,
    backgroundColor: 'transparent',
  },
  deleteBtnPressed: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
  },
  deleteBtnText: {
    color: colors.semantic.error,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
