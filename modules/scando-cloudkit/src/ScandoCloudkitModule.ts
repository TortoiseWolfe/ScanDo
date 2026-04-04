import { requireNativeModule } from 'expo-modules-core';
import type { ScandoCloudkitModuleInterface } from './ScandoCloudkit.types';

export const ScandoCloudkit =
  requireNativeModule<ScandoCloudkitModuleInterface>('ScandoCloudkit');
