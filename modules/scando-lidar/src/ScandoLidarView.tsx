import React from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';

export type ScandoLidarViewProps = ViewProps;

// Lazily resolve the native view manager on first render to avoid
// crashing the JS bundle at import time if the native module
// isn't fully registered when expo-router pre-loads screens.
let NativeView: React.ComponentType<ScandoLidarViewProps> | null = null;
let resolutionAttempted = false;

function resolveNativeView(): React.ComponentType<ScandoLidarViewProps> | null {
  if (resolutionAttempted) return NativeView;
  resolutionAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { requireNativeViewManager } = require('expo-modules-core');
    NativeView = requireNativeViewManager(
      'ScandoLidar',
    ) as React.ComponentType<ScandoLidarViewProps>;
  } catch (e) {
    console.warn('ScandoLidarView: native view not available', e);
    NativeView = null;
  }
  return NativeView;
}

export default function ScandoLidarView(props: ScandoLidarViewProps) {
  const Resolved = resolveNativeView();
  if (!Resolved) {
    // Fallback: plain black view so the app never crashes
    return <View {...props} />;
  }
  return <Resolved {...props} />;
}
