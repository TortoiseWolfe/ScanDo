import type { ScandoLidarModuleInterface } from './ScandoLidar.types';

// Lazily resolve the native module on first access to avoid crashing
// the JS bundle at import time if the native side isn't ready.
let cached: ScandoLidarModuleInterface | null = null;
let resolutionAttempted = false;

function resolveModule(): ScandoLidarModuleInterface {
  if (resolutionAttempted && cached) return cached;
  if (resolutionAttempted && !cached) {
    throw new Error('ScandoLidar native module is not available');
  }
  resolutionAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const expoModulesCore = require('expo-modules-core');
    cached = expoModulesCore.requireNativeModule(
      'ScandoLidar',
    ) as ScandoLidarModuleInterface;
    return cached!;
  } catch (e) {
    console.warn('ScandoLidar: failed to load native module', e);
    throw e;
  }
}

// Proxy so calls lazily resolve the real module
export const ScandoLidar: ScandoLidarModuleInterface = new Proxy(
  {} as ScandoLidarModuleInterface,
  {
    get(_target, prop) {
      const mod = resolveModule();
      const value = (mod as unknown as Record<string | symbol, unknown>)[prop];
      if (typeof value === 'function') {
        return value.bind(mod);
      }
      return value;
    },
  },
);
