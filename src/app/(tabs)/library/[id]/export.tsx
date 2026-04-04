import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MOCK_SCANS } from '@/utils/mockData';
import ExportFormatPicker from '@/components/export/ExportFormatPicker';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

type ExportState = 'selecting' | 'exporting' | 'complete';

export default function ExportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scan = MOCK_SCANS.find((s) => s.id === id);

  const [exportState, setExportState] = useState<ExportState>('selecting');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId);
    setExportState('exporting');
    setProgress(0);

    // Simulate export progress
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setExportState('complete');
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  if (!scan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Scan not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scan name header */}
      <View style={styles.header}>
        <Text style={styles.scanName}>{scan.name}</Text>
        <Text style={styles.scanLabel}>EXPORT SCAN</Text>
      </View>

      {/* Format selection state */}
      {exportState === 'selecting' && (
        <ExportFormatPicker onSelect={handleFormatSelect} proEnabled={false} />
      )}

      {/* Exporting progress state */}
      {exportState === 'exporting' && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            EXPORTING AS {selectedFormat?.toUpperCase()}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
      )}

      {/* Export complete state */}
      {exportState === 'complete' && (
        <View style={styles.completeContainer}>
          {/* Checkmark circle */}
          <View style={styles.checkCircle}>
            <View style={styles.checkStemLong} />
            <View style={styles.checkStemShort} />
          </View>

          <Text style={styles.completeTitle}>Export Complete</Text>
          <Text style={styles.completeFormat}>
            {scan.name}.{selectedFormat}
          </Text>

          {/* Action buttons */}
          <View style={styles.completeActions}>
            <Pressable
              style={({ pressed }) => [
                styles.completeBtn,
                styles.shareBtn,
                pressed && styles.shareBtnPressed,
              ]}
              onPress={() => {
                /* Share not implemented */
              }}
              accessibilityRole="button"
              accessibilityLabel="Share exported file"
            >
              <Text style={styles.shareBtnText}>SHARE</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.completeBtn,
                styles.saveBtn,
                pressed && styles.saveBtnPressed,
              ]}
              onPress={() => {
                /* Save not implemented */
              }}
              accessibilityRole="button"
              accessibilityLabel="Save to Files"
            >
              <Text style={styles.saveBtnText}>SAVE TO FILES</Text>
            </Pressable>
          </View>
        </View>
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
  scanName: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  scanLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
  // Progress state
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  progressLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: spacing.xl,
    fontFamily: 'monospace',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.surface.default,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent.secondary,
    borderRadius: 2,
  },
  progressPercent: {
    color: colors.accent.secondary,
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginTop: spacing.lg,
    letterSpacing: 1,
  },
  // Complete state
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  checkStemLong: {
    width: 20,
    height: 2.5,
    backgroundColor: colors.semantic.success,
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    left: 18,
    top: 28,
  },
  checkStemShort: {
    width: 12,
    height: 2.5,
    backgroundColor: colors.semantic.success,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    left: 12,
    top: 30,
  },
  completeTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: spacing.sm,
  },
  completeFormat: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginBottom: spacing.xxl,
  },
  completeActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  completeBtn: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    backgroundColor: colors.accent.secondary,
  },
  shareBtnPressed: {
    backgroundColor: colors.accent.secondaryDark,
  },
  shareBtnText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  saveBtn: {
    borderWidth: 1.5,
    borderColor: colors.accent.secondary,
    backgroundColor: 'transparent',
  },
  saveBtnPressed: {
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
  },
  saveBtnText: {
    color: colors.accent.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
