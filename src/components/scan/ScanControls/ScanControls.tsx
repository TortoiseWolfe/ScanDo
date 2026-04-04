import React, { useEffect, useRef } from 'react';
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

interface ScanControlsProps {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  isScanning?: boolean;
  isPaused?: boolean;
}

/**
 * Precision instrument scan controls.
 * Large primary SCAN button with secondary pause/stop actions.
 * The start button pulses with a cyan glow when actively scanning.
 */
const ScanControls: React.FC<ScanControlsProps> = ({
  onStart,
  onPause,
  onStop,
  isScanning = false,
  isPaused = false,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isScanning && !isPaused) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      );
      const scale = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.06,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      glow.start();
      scale.start();

      return () => {
        glow.stop();
        scale.stop();
        glowAnim.setValue(0);
        scaleAnim.setValue(1);
      };
    }
  }, [isScanning, isPaused, glowAnim, scaleAnim]);

  const glowBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.accent.secondary, colors.accent.secondaryLight],
  });

  const glowShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const startLabel = isPaused ? 'RESUME' : isScanning ? 'SCANNING' : 'SCAN';

  return (
    <View style={styles.container}>
      {/* Pause button */}
      <TouchableOpacity
        style={[
          styles.secondaryButton,
          (!isScanning || isPaused) && styles.buttonDisabled,
        ]}
        onPress={onPause}
        disabled={!isScanning || isPaused}
        activeOpacity={0.6}
      >
        <View style={styles.pauseIcon}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </View>
        <Text
          style={[
            styles.secondaryLabel,
            (!isScanning || isPaused) && styles.labelDisabled,
          ]}
        >
          PAUSE
        </Text>
      </TouchableOpacity>

      {/* Primary scan button */}
      <Animated.View
        style={[
          styles.primaryGlow,
          isScanning &&
            !isPaused && {
              transform: [{ scale: scaleAnim }],
            },
        ]}
      >
        <Animated.View
          style={[
            styles.primaryBorderRing,
            isScanning &&
              !isPaused && {
                borderColor: glowBorderColor,
                shadowOpacity: glowShadowOpacity,
              },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isScanning && !isPaused && styles.primaryButtonActive,
            ]}
            onPress={onStart}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.primaryLabel,
                isScanning && !isPaused && styles.primaryLabelActive,
              ]}
            >
              {startLabel}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Stop button */}
      <TouchableOpacity
        style={[styles.secondaryButton, !isScanning && styles.buttonDisabled]}
        onPress={onStop}
        disabled={!isScanning}
        activeOpacity={0.6}
      >
        <View style={[styles.stopIcon, isScanning && styles.stopIconActive]} />
        <Text
          style={[
            styles.secondaryLabel,
            !isScanning && styles.labelDisabled,
            isScanning && styles.stopLabelActive,
          ]}
        >
          STOP
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  // Primary button
  primaryGlow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBorderRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: colors.accent.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  primaryButtonActive: {
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
    borderColor: colors.accent.secondary,
  },
  primaryLabel: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent.secondary,
    letterSpacing: 3,
  },
  primaryLabelActive: {
    color: colors.accent.secondaryLight,
  },

  // Secondary buttons
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  secondaryLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 8,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    letterSpacing: 1.5,
    marginTop: spacing.xxs,
  },
  labelDisabled: {
    color: colors.text.disabled,
  },

  // Pause icon: two vertical bars
  pauseIcon: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBar: {
    width: 4,
    height: 16,
    backgroundColor: colors.text.secondary,
    borderRadius: 1,
  },

  // Stop icon: square
  stopIcon: {
    width: 14,
    height: 14,
    backgroundColor: colors.text.secondary,
    borderRadius: 2,
  },
  stopIconActive: {
    backgroundColor: colors.semantic.error,
  },
  stopLabelActive: {
    color: colors.semantic.error,
  },
});

export default ScanControls;
