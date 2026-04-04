import { requireNativeModule } from 'expo-modules-core';
import type { ScandoLidarModuleInterface } from './ScandoLidar.types';

export const ScandoLidar =
  requireNativeModule<ScandoLidarModuleInterface>('ScandoLidar');
