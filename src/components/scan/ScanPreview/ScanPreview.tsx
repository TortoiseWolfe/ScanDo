import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/theme/colors';

interface ScanPreviewProps {
  scanning?: boolean;
  style?: ViewStyle;
}

/**
 * Animated wireframe grid that simulates a LiDAR mesh preview.
 * Uses Animated transforms with perspective + rotateX to give
 * the appearance of a receding 3D floor grid.
 */
const ScanPreview: React.FC<ScanPreviewProps> = ({
  scanning = false,
  style,
}) => {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const scanPulse = useRef(new Animated.Value(0)).current;

  // Slow breathing scale for the grid
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [breatheAnim]);

  // Faster pulse when scanning
  useEffect(() => {
    if (scanning) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scanPulse, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scanPulse, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      return () => {
        anim.stop();
        scanPulse.setValue(0);
      };
    }
  }, [scanning, scanPulse]);

  const gridScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  const gridOpacity = scanning
    ? scanPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
      })
    : breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.15, 0.3],
      });

  const lineCount = scanning ? 16 : 10;
  const horizontalLines = Array.from({ length: lineCount }, (_, i) => i);
  const verticalLines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <View style={[styles.container, style]}>
      {/* Perspective grid floor */}
      <Animated.View
        style={[
          styles.gridWrapper,
          {
            opacity: gridOpacity,
            transform: [
              { perspective: 400 },
              { rotateX: '55deg' },
              { scale: gridScale },
            ],
          },
        ]}
      >
        {/* Horizontal lines */}
        {horizontalLines.map((i) => {
          const spacing = 100 / (lineCount - 1);
          return (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLineH,
                {
                  top: `${i * spacing}%`,
                  backgroundColor: scanning
                    ? colors.scanner.meshWireframe
                    : colors.accent.secondary,
                  opacity: scanning ? 0.6 : 0.35,
                },
              ]}
            />
          );
        })}
        {/* Vertical lines */}
        {verticalLines.map((i) => {
          const spacing = 100 / (lineCount - 1);
          return (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLineV,
                {
                  left: `${i * spacing}%`,
                  backgroundColor: scanning
                    ? colors.scanner.meshWireframe
                    : colors.accent.secondary,
                  opacity: scanning ? 0.6 : 0.35,
                },
              ]}
            />
          );
        })}
      </Animated.View>

      {/* Scan sweep line */}
      {scanning && (
        <Animated.View
          style={[
            styles.sweepLine,
            {
              opacity: scanPulse.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.1, 0.5, 0.1],
              }),
              transform: [
                {
                  translateY: scanPulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 100],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* Vignette edges */}
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gridWrapper: {
    width: '120%',
    height: '120%',
    position: 'absolute',
  },

  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },

  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },

  sweepLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.scanner.meshWireframe,
  },

  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    // Simulated gradient via layered opacity
    opacity: 0.8,
  },

  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
});

export default ScanPreview;
