import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontFamily, fontSize, fontWeight } from '@/theme/typography';
import { formatNumber } from '@/utils/format';
import ScanPreview from '@/components/scan/ScanPreview/ScanPreview';

type ScanState = 'idle' | 'scanning' | 'complete';

export default function ScanScreen() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [vertices, setVertices] = useState(0);
  const [faces, setFaces] = useState(0);
  const [triangles, setTriangles] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const reticleOpacity = useRef(new Animated.Value(0.6)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;
  const bracketRotate = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;

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

  // Scanning animations
  useEffect(() => {
    if (scanState === 'scanning') {
      // Button pulse
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

      // Button glow
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGlow, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlow, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      );
      glow.start();

      // Bracket rotation
      const rotate = Animated.loop(
        Animated.timing(bracketRotate, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      rotate.start();

      return () => {
        pulse.stop();
        glow.stop();
        rotate.stop();
        pulseAnim.setValue(1);
        buttonGlow.setValue(0);
        bracketRotate.setValue(0);
      };
    }
  }, [scanState, pulseAnim, buttonGlow, bracketRotate]);

  // Data simulation interval
  useEffect(() => {
    if (scanState === 'scanning') {
      intervalRef.current = setInterval(() => {
        setVertices((v) => v + Math.floor(Math.random() * 1200 + 400));
        setFaces((f) => f + Math.floor(Math.random() * 2400 + 800));
        setTriangles((t) => t + Math.floor(Math.random() * 3600 + 1200));
      }, 100);

      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [scanState]);

  const handleScanPress = useCallback(() => {
    if (scanState === 'idle' || scanState === 'complete') {
      setVertices(0);
      setFaces(0);
      setTriangles(0);
      setElapsed(0);
      setScanState('scanning');
    } else if (scanState === 'scanning') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setScanState('complete');
    }
  }, [scanState]);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const bracketSpin = bracketRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowColor = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 217, 255, 0.0)', 'rgba(0, 217, 255, 0.35)'],
  });

  const isScanning = scanState === 'scanning';
  const isComplete = scanState === 'complete';

  return (
    <View style={styles.screen}>
      {/* Top device readout strip */}
      <View style={styles.deviceStrip}>
        <Text style={styles.deviceText}>
          {isScanning ? 'LiDAR: ACTIVE' : 'LiDAR: UNAVAILABLE (Web Preview)'}
        </Text>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isScanning
                ? colors.semantic.success
                : colors.text.tertiary,
            },
          ]}
        />
      </View>

      {/* Top bar: wordmark + tier badge */}
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>SCANDO</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>FREE</Text>
        </View>
      </View>

      {/* Main viewport area */}
      <View style={styles.viewport}>
        {/* Scan preview background */}
        <ScanPreview scanning={isScanning} style={styles.previewBg} />

        {/* Reticle overlay */}
        <Animated.View
          style={[
            styles.reticleContainer,
            {
              opacity: isScanning ? 1 : reticleOpacity,
              transform: isScanning ? [{ rotate: bracketSpin }] : [],
            },
          ]}
        >
          {/* Top-left bracket */}
          <View style={[styles.bracket, styles.bracketTL]} />
          {/* Top-right bracket */}
          <View style={[styles.bracket, styles.bracketTR]} />
          {/* Bottom-left bracket */}
          <View style={[styles.bracket, styles.bracketBL]} />
          {/* Bottom-right bracket */}
          <View style={[styles.bracket, styles.bracketBR]} />
        </Animated.View>

        {/* Center dot */}
        <Animated.View
          style={[
            styles.centerDot,
            {
              transform: [{ scale: isScanning ? dotPulse : 1 }],
              backgroundColor: isScanning
                ? colors.accent.secondary
                : colors.text.tertiary,
            },
          ]}
        />

        {/* Crosshair lines */}
        <View style={styles.crosshairH} />
        <View style={styles.crosshairV} />
      </View>

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
            <Text style={styles.readoutValue}>{formatNumber(triangles)}</Text>
            <Text style={styles.readoutLabel}>TRIANGLES</Text>
          </View>
        </View>
        <Text style={styles.elapsedText}>T+ {formatElapsed(elapsed)}</Text>
      </View>

      {/* Scan button */}
      <View style={styles.buttonArea}>
        <Animated.View
          style={[
            styles.buttonGlowRing,
            isScanning && {
              backgroundColor: glowColor,
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
          >
            <View
              style={[
                styles.scanButtonInner,
                isScanning && styles.scanButtonInnerActive,
              ]}
            >
              <Text
                style={[
                  styles.scanButtonText,
                  isScanning && styles.scanButtonTextActive,
                ]}
              >
                {isScanning ? 'STOP' : isComplete ? 'RESCAN' : 'SCAN'}
              </Text>
            </View>
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

  // Device strip
  deviceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  deviceText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    color: colors.text.tertiary,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  tierText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.subscription.free,
    letterSpacing: 2,
  },

  // Viewport
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'relative',
  },
  previewBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Reticle
  reticleContainer: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    position: 'relative',
  },
  bracket: {
    position: 'absolute',
    borderColor: colors.accent.secondary,
  },
  bracketTL: {
    top: 0,
    left: 0,
    width: BRACKET_LENGTH,
    height: BRACKET_LENGTH,
    borderTopWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
  },
  bracketTR: {
    top: 0,
    right: 0,
    width: BRACKET_LENGTH,
    height: BRACKET_LENGTH,
    borderTopWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    width: BRACKET_LENGTH,
    height: BRACKET_LENGTH,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    width: BRACKET_LENGTH,
    height: BRACKET_LENGTH,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
  },

  // Center dot
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Crosshair lines
  crosshairH: {
    position: 'absolute',
    width: RETICLE_SIZE * 0.35,
    height: 1,
    backgroundColor: colors.accent.secondary,
    opacity: 0.25,
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    height: RETICLE_SIZE * 0.35,
    backgroundColor: colors.accent.secondary,
    opacity: 0.25,
  },

  // Readout
  readoutContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  completeLabel: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.semantic.success,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  readoutGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.default,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  readoutCell: {
    flex: 1,
    alignItems: 'center',
  },
  readoutValue: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  readoutLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    fontWeight: fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 2,
    marginTop: spacing.xxs,
  },
  readoutDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border.default,
    marginHorizontal: spacing.sm,
  },
  elapsedText: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    letterSpacing: 2,
    marginTop: spacing.sm,
  },

  // Button
  buttonArea: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  buttonGlowRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.accent.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scanButtonActive: {
    borderColor: colors.semantic.error,
  },
  scanButtonComplete: {
    borderColor: colors.semantic.success,
  },
  scanButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  scanButtonInnerActive: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderColor: colors.semantic.error,
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
