import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontFamily, fontSize, fontWeight } from '@/theme/typography';
import { formatNumber } from '@/utils/format';
import { ScandoLidar, ScandoLidarView } from '@modules/scando-lidar';

type ScanState = 'idle' | 'scanning' | 'complete' | 'error';

interface MeshCounts {
  vertices: number;
  faces: number;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [vertices, setVertices] = useState(0);
  const [faces, setFaces] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [lidarAvailable, setLidarAvailable] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track mesh counts per anchor — ARKit sends updates for individual anchors,
  // we sum them here
  const anchorCountsRef = useRef<Map<string, MeshCounts>>(new Map());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meshSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const errorSubscriptionRef = useRef<{ remove: () => void } | null>(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const reticleOpacity = useRef(new Animated.Value(0.6)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;

  // Check LiDAR availability on mount
  useEffect(() => {
    try {
      const available = ScandoLidar.isLidarAvailable();
      setLidarAvailable(available);
    } catch (e) {
      console.warn('Failed to check LiDAR availability', e);
      setLidarAvailable(false);
    }
  }, []);

  // Idle reticle breathing animation
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(reticleOpacity, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(reticleOpacity, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    breathe.start();
    return () => breathe.stop();
  }, [reticleOpacity]);

  // Center dot pulse
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1.4,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [dotPulse]);

  // Scanning button pulse
  useEffect(() => {
    if (scanState === 'scanning') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => {
        pulse.stop();
        pulseAnim.setValue(1);
      };
    }
  }, [scanState, pulseAnim]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (meshSubscriptionRef.current) meshSubscriptionRef.current.remove();
      if (errorSubscriptionRef.current) errorSubscriptionRef.current.remove();
      // Best-effort stop if still scanning
      ScandoLidar.stopSession().catch(() => {});
    };
  }, []);

  const handleScanPress = useCallback(async () => {
    if (scanState === 'scanning') {
      // Stop the scan
      try {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (meshSubscriptionRef.current) {
          meshSubscriptionRef.current.remove();
          meshSubscriptionRef.current = null;
        }
        if (errorSubscriptionRef.current) {
          errorSubscriptionRef.current.remove();
          errorSubscriptionRef.current = null;
        }
        await ScandoLidar.stopSession();
        setScanState('complete');
      } catch (e) {
        console.warn('Failed to stop session', e);
        setScanState('complete');
      }
      return;
    }

    // Request camera permission if not granted
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        setErrorMessage('Camera permission is required to scan');
        setScanState('error');
        return;
      }
    }

    // Reset state
    setVertices(0);
    setFaces(0);
    setElapsed(0);
    setErrorMessage(null);
    anchorCountsRef.current.clear();

    try {
      // Subscribe to mesh updates
      meshSubscriptionRef.current = ScandoLidar.addListener(
        'onMeshUpdate',
        (event: {
          anchorId: string;
          vertexCount: number;
          faceCount: number;
        }) => {
          anchorCountsRef.current.set(event.anchorId, {
            vertices: event.vertexCount,
            faces: event.faceCount,
          });
          // Sum all anchor counts
          let totalV = 0;
          let totalF = 0;
          for (const counts of anchorCountsRef.current.values()) {
            totalV += counts.vertices;
            totalF += counts.faces;
          }
          setVertices(totalV);
          setFaces(totalF);
        },
      );

      errorSubscriptionRef.current = ScandoLidar.addListener(
        'onError',
        (event: { code: string; message: string }) => {
          console.warn('LiDAR error', event);
          setErrorMessage(event.message);
          setScanState('error');
        },
      );

      // Start timer
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);

      // Start the actual ARKit session
      await ScandoLidar.startSession();
      setScanState('scanning');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to start scan';
      console.warn('Failed to start session', e);
      setErrorMessage(msg);
      setScanState('error');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (meshSubscriptionRef.current) {
        meshSubscriptionRef.current.remove();
        meshSubscriptionRef.current = null;
      }
      if (errorSubscriptionRef.current) {
        errorSubscriptionRef.current.remove();
        errorSubscriptionRef.current = null;
      }
    }
  }, [scanState, permission, requestPermission]);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isScanning = scanState === 'scanning';
  const isComplete = scanState === 'complete';
  const isError = scanState === 'error';

  // Show camera permission prompt if needed
  if (permission && !permission.granted && permission.canAskAgain === false) {
    return (
      <View style={styles.screen}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>CAMERA ACCESS REQUIRED</Text>
          <Text style={styles.permissionText}>
            AsBuilt LiDAR needs camera access to scan. Enable it in Settings.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* AR Camera View as background */}
      <ScandoLidarView style={StyleSheet.absoluteFillObject} />

      {/* Dark overlay so UI is readable */}
      <View style={styles.overlay} pointerEvents="none" />

      {/* Top device readout strip */}
      <View style={styles.deviceStrip}>
        <Text style={styles.deviceText}>
          {lidarAvailable === null
            ? 'LiDAR: CHECKING...'
            : lidarAvailable
              ? isScanning
                ? 'LiDAR: ACTIVE'
                : 'LiDAR: READY'
              : 'LiDAR: UNAVAILABLE'}
        </Text>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isScanning
                ? colors.semantic.success
                : lidarAvailable
                  ? colors.accent.secondary
                  : colors.semantic.error,
            },
          ]}
        />
      </View>

      {/* Top bar: wordmark + tier badge */}
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>ASBUILT</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>FREE</Text>
        </View>
      </View>

      {/* Main viewport area */}
      <View style={styles.viewport} pointerEvents="none">
        {/* Reticle overlay */}
        <Animated.View
          style={[
            styles.reticleContainer,
            {
              opacity: isScanning ? 1 : reticleOpacity,
            },
          ]}
        >
          <View style={[styles.bracket, styles.bracketTL]} />
          <View style={[styles.bracket, styles.bracketTR]} />
          <View style={[styles.bracket, styles.bracketBL]} />
          <View style={[styles.bracket, styles.bracketBR]} />
        </Animated.View>

        {/* Center dot */}
        <Animated.View
          style={[
            styles.centerDot,
            {
              transform: [{ scale: dotPulse }],
              backgroundColor: isScanning
                ? colors.accent.secondary
                : colors.text.tertiary,
            },
          ]}
        />
      </View>

      {/* Error message */}
      {isError && errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Status readout */}
      <View style={styles.readoutContainer}>
        {isComplete && <Text style={styles.completeLabel}>SCAN COMPLETE</Text>}
        <View style={styles.readoutGrid}>
          <View style={styles.readoutCell}>
            <Text style={styles.readoutValue}>{formatNumber(vertices)}</Text>
            <Text style={styles.readoutLabel}>VERTICES</Text>
          </View>
          <View style={styles.readoutDivider} />
          <View style={styles.readoutCell}>
            <Text style={styles.readoutValue}>{formatNumber(faces)}</Text>
            <Text style={styles.readoutLabel}>FACES</Text>
          </View>
          <View style={styles.readoutDivider} />
          <View style={styles.readoutCell}>
            <Text style={styles.readoutValue}>{formatElapsed(elapsed)}</Text>
            <Text style={styles.readoutLabel}>ELAPSED</Text>
          </View>
        </View>
      </View>

      {/* Scan button */}
      <View style={styles.buttonArea}>
        <Animated.View
          style={[
            styles.buttonGlowRing,
            isScanning && {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.scanButton,
              isScanning && styles.scanButtonActive,
              isComplete && styles.scanButtonComplete,
            ]}
            onPress={handleScanPress}
            activeOpacity={0.7}
            disabled={lidarAvailable === false}
          >
            <Text
              style={[
                styles.scanButtonText,
                isScanning && styles.scanButtonTextActive,
              ]}
            >
              {isScanning ? 'STOP' : isComplete ? 'RESCAN' : 'SCAN'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const RETICLE_SIZE = 180;
const BRACKET_LENGTH = 40;
const BRACKET_THICKNESS = 3;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 15, 0.35)',
  },

  // Permission denied
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  permissionTitle: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.semantic.error,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  permissionText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Device strip
  deviceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 56,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  deviceText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    color: colors.text.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  wordmark: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 6,
  },
  tierBadge: {
    borderWidth: 1,
    borderColor: colors.subscription.free,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tierText: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    fontWeight: fontWeight.semibold,
    color: colors.subscription.free,
    letterSpacing: 2,
  },

  // Viewport
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleContainer: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    position: 'relative',
  },
  bracket: {
    position: 'absolute',
    width: BRACKET_LENGTH,
    height: BRACKET_LENGTH,
    borderColor: colors.accent.secondary,
  },
  bracketTL: {
    top: 0,
    left: 0,
    borderTopWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
  },
  bracketTR: {
    top: 0,
    right: 0,
    borderTopWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
  },
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Error
  errorContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderWidth: 1,
    borderColor: colors.semantic.error,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.semantic.error,
    textAlign: 'center',
  },

  // Readout
  readoutContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  completeLabel: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.semantic.success,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  readoutGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingVertical: spacing.md,
  },
  readoutCell: {
    flex: 1,
    alignItems: 'center',
  },
  readoutValue: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.accent.secondary,
    letterSpacing: 0.5,
  },
  readoutLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 8,
    fontWeight: fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 2,
    marginTop: 4,
  },
  readoutDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border.light,
  },

  // Scan button
  buttonArea: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: spacing.lg,
  },
  buttonGlowRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.accent.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
  },
  scanButtonActive: {
    borderColor: colors.semantic.error,
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
  },
  scanButtonComplete: {
    borderColor: colors.semantic.success,
  },
  scanButtonText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent.secondary,
    letterSpacing: 3,
  },
  scanButtonTextActive: {
    color: colors.semantic.error,
  },
});
