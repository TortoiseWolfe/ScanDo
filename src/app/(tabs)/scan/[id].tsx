import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontFamily, fontSize, fontWeight } from '@/theme/typography';
import {
  formatFileSize,
  formatDuration,
  formatDate,
  formatNumber,
} from '@/utils/format';
import { MOCK_SCANS } from '@/utils/mockData';

interface StatCardProps {
  value: string;
  label: string;
  accent?: boolean;
}

function StatCard({ value, label, accent = false }: StatCardProps) {
  return (
    <View style={statStyles.card}>
      <Text
        style={[statStyles.value, accent && { color: colors.accent.secondary }]}
      >
        {value}
      </Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  value: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    fontWeight: fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 2,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
});

export default function ScanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const scan = MOCK_SCANS.find((s) => s.id === id) ?? MOCK_SCANS[0];

  const hasGeo = !!scan.geoLocation;
  const geoStatus = hasGeo
    ? scan.geoLocation!.isGeoTracked
      ? 'GEO-TRACKED'
      : 'GPS ONLY'
    : 'NONE';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>SCAN DATA</Text>
        <Text style={styles.headerTitle}>{scan.name}</Text>
        <Text style={styles.headerMeta}>
          {formatDate(scan.createdAt)} {'  '}ID: {scan.id}
        </Text>
      </View>

      {/* Divider line */}
      <View style={styles.divider} />

      {/* Stats grid: 2 columns x 3 rows */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            value={formatNumber(scan.vertexCount)}
            label="Vertices"
            accent
          />
          <View style={styles.statGap} />
          <StatCard value={formatNumber(scan.faceCount)} label="Faces" accent />
        </View>

        <View style={styles.statsRow}>
          <StatCard value={formatFileSize(scan.fileSize)} label="File Size" />
          <View style={styles.statGap} />
          <StatCard value={formatDuration(scan.duration)} label="Duration" />
        </View>

        <View style={styles.statsRow}>
          <StatCard value={formatDate(scan.createdAt)} label="Captured" />
          <View style={styles.statGap} />
          <StatCard value={geoStatus} label="Geolocation" />
        </View>
      </View>

      {/* Geo detail (if available) */}
      {hasGeo && (
        <View style={styles.geoSection}>
          <Text style={styles.geoHeader}>COORDINATES</Text>
          <View style={styles.geoRow}>
            <Text style={styles.geoLabel}>LAT</Text>
            <Text style={styles.geoValue}>
              {scan.geoLocation!.latitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.geoRow}>
            <Text style={styles.geoLabel}>LON</Text>
            <Text style={styles.geoValue}>
              {scan.geoLocation!.longitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.geoRow}>
            <Text style={styles.geoLabel}>ALT</Text>
            <Text style={styles.geoValue}>
              {scan.geoLocation!.altitude.toFixed(1)} m
            </Text>
          </View>
          <View style={styles.geoRow}>
            <Text style={styles.geoLabel}>H-ACC</Text>
            <Text style={styles.geoValue}>
              {scan.geoLocation!.horizontalAccuracy.toFixed(1)} m
            </Text>
          </View>
        </View>
      )}

      {/* Mesh density readout */}
      <View style={styles.densitySection}>
        <Text style={styles.densityHeader}>MESH DENSITY</Text>
        <Text style={styles.densityValue}>
          {(scan.faceCount / scan.vertexCount).toFixed(2)} faces/vertex
        </Text>
        <Text style={styles.densityValue}>
          {(scan.vertexCount / scan.duration).toFixed(0)} vertices/sec
        </Text>
      </View>

      {/* Export button */}
      <TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
        <Text style={styles.exportButtonText}>EXPORT MESH</Text>
      </TouchableOpacity>

      {/* Format options */}
      <View style={styles.formatRow}>
        {['USDZ', 'OBJ', 'PLY', 'STL'].map((fmt) => (
          <View key={fmt} style={styles.formatChip}>
            <Text style={styles.formatChipText}>{fmt}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },

  // Header
  header: {
    marginBottom: spacing.lg,
  },
  headerLabel: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.accent.secondary,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    lineHeight: fontSize.xxl * 1.2,
  },
  headerMeta: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    letterSpacing: 0.5,
    marginTop: spacing.sm,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginBottom: spacing.xl,
  },

  // Stats grid
  statsGrid: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statGap: {
    width: spacing.sm,
  },

  // Geo section
  geoSection: {
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  geoHeader: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.accent.secondary,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  geoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  geoLabel: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 2,
  },
  geoValue: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },

  // Density
  densitySection: {
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  densityHeader: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  densityValue: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },

  // Export
  exportButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent.secondary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  exportButtonText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent.secondary,
    letterSpacing: 4,
  },

  // Format chips
  formatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  formatChip: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface.default,
  },
  formatChipText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 2,
  },
});
